<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Expense;
use App\Models\Order;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Returns;
use App\Models\Supplier;
use App\Models\User;
use Exception;
use Facade\FlareClient\Http\Response as HttpResponse;
use Faker\Core\Number;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpParser\Node\Expr\Cast\Object_;
use Symfony\Component\HttpFoundation\Response;

class StatisticController extends Controller
{
    public function getAll(Request $request)
    {
        try {
            //get all parts
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => ""
            ]);
            //get sales Statistics
            $filterData = $this->filterData($validateFields, "orders.created_at");
            $sales = $this->sales($filterData);
            //get purchases statistics
            $filterData = $this->filterData($validateFields, "purchases.created_at");
            $purchases = $this->purchases($filterData);
            //get spentes
            $filterData = $this->filterData($validateFields, "expenses.created_at");
            $costs = $this->costs($filterData);
            //get returns
            $filterData = $this->filterData($validateFields, "returns.created_at");
            $returns = $this->returns($filterData);
            //get stocks
            $stocks = $this->stocks();
            //get users 
            $users = $this->users();
            //get user Turnover
            $filterData = $this->filterData($validateFields, "orders.created_at");
            $usersTurnover = $this->usersTurnover($filterData);
            //get customers Turnover
            $filterData = $this->filterData($validateFields, "orders.created_at");
            $customers = $this->customers($filterData);
            //get suppliers Turnover
            $filterData = $this->filterData($validateFields, "purchases.created_at");
            $suppliers = $this->suppliers($filterData);
            //prepare data to return 
            $dataToReturn["sales"] = $sales;
            $dataToReturn["purchases"] = $purchases;
            $dataToReturn["costs"] = $costs;
            $dataToReturn["returns"] = $returns;
            $dataToReturn["stocks"] = $stocks;
            $dataToReturn["users"] = $users;
            $dataToReturn["usersTurnover"] = $usersTurnover;
            $dataToReturn["customers"] = $customers;
            $dataToReturn["suppliers"] = $suppliers;
            $dataToReturn["filterTitle"] = $filterData["filterTitle"];
            return response(["message" => "success", "data" => $dataToReturn], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function sales($filterData)
    {
        $sales = Order::join('details_orders', 'details_orders.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', $filterData["filter"])
            ->select(
                DB::raw($filterData["filterType"]),
                DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
            )
            ->groupBy("date")
            ->orderBy('date')
            ->get();
        $count = 0;
        foreach ($sales as $sale) {
            $count += $sale->order_count;
        }
        $sales = parent::prepareTurnover($sales, $filterData["days"], $filterData["prefix"]);
        $sales["count"] = $count;
        return $sales;
    }
    public function purchases($filterData)
    {
        $purchases = Purchase::join("stocks", "purchases.id", "=", "stocks.purchase_id")
            ->whereBetween('purchases.created_at', $filterData["filter"])
            ->select(
                DB::raw($filterData["filterType"]),
                DB::raw('COUNT(DISTINCT purchases.id) as purchase_count'),
                DB::raw('SUM((stocks.price * stocks.stock_init)) as turnover')
            )
            ->groupBy("date")
            ->orderBy('date')
            ->get();
        $count = 0;
        foreach ($purchases as $item) {
            $count += $item->purchase_count;
        }
        $purchases = parent::prepareTurnover($purchases, $filterData["days"], $filterData["prefix"]);
        $purchases["count"] = $count;
        return $purchases;
    }
    public function costs($filterData)
    {
        $costs =  Expense::whereBetween('expenses.created_at', $filterData["filter"])
            ->select(
                DB::raw($filterData["filterType"]),
                DB::raw('COUNT(expenses.id) as costs_count'),
                DB::raw('SUM(expenses.amount) as turnover')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        $count = 0;
        foreach ($costs as $item) {
            $count += $item->costs_count;
        }
        $costs = parent::prepareTurnover($costs, $filterData["days"], $filterData["prefix"]);
        $costs["count"] = $count;
        return $costs;
    }
    public function returns($filterData)
    {
        $returns = Returns::join(
            'details_returns',
            'details_returns.return_id',
            '=',
            'returns.id'
        )
            ->whereBetween('returns.created_at', $filterData["filter"])
            ->select(
                DB::raw($filterData["filterType"]),
                DB::raw('COUNT(DISTINCT returns.id) as returns_count'),
                DB::raw('SUM((details_returns.price * details_returns.qnt)) as turnover')
            )
            ->groupBy("date")
            ->orderBy('date')
            ->get();
        $count = 0;
        foreach ($returns as $item) {
            $count += $item->returns_count;
        }
        $returns = parent::prepareTurnover($returns, $filterData["days"], $filterData["prefix"]);
        $returns["count"] = $count;
        return $returns;
    }
    public function stocks()
    {
        $stocks = Product::leftJoin('stocks', 'products.id', '=', 'stocks.product_id')
            ->select(
                DB::raw('SUM(IFNULL(stocks.stock_actuel, 0)) as total_stock'),
                DB::raw('SUM(IFNULL(stocks.stock_actuel, 0) * stocks.price) as turnover_stock'),
            )
            ->groupBy('products.id')
            ->get();
        $parts[0] = 0;
        $parts[1] = 0;
        $parts[2] = 0;
        $parts[3] = 0;
        $parts[4] = 0;
        $parts[5] = 0;
        $turnover = 0;
        $totalStock = 0;
        foreach ($stocks as $stock) {
            $turnover += (float)$stock->turnover_stock;
            $totalStock += (int)$stock->total_stock;
            if ((int)$stock->total_stock >= 0 && (int)$stock->total_stock < 50) {
                $parts[0]++;
            } else if ((int)$stock->total_stock >= 50 && (int)$stock->total_stock < 100) {
                $parts[1]++;
            } else if ((int)$stock->total_stock >= 100 && (int)$stock->total_stock < 200) {
                $parts[2]++;
            } else if ((int)$stock->total_stock >= 200 && (int)$stock->total_stock < 300) {
                $parts[3]++;
            } else if ((int)$stock->total_stock >= 300 && (int)$stock->total_stock < 400) {
                $parts[4]++;
            } else if ((int)$stock->total_stock >= 300) {
                $parts[5]++;
            }
        }
        return ["data" => $parts, "turnover" => $turnover, "total" => $totalStock];
    }
    public function users()
    {
        $allUsers = User::leftJoin("orders", "users.id", "=", "orders.user_id")
            ->leftJoin('details_orders', 'details_orders.order_id', '=', 'orders.id')
            ->select(
                "users.id as id",
                "users.name as name",
                "users.picture as picture",
                DB::raw("IFNULL(SUM(CASE WHEN orders.payed_margin = 0 and orders.status ='delivered' THEN details_orders.margin END ),0) as earning"),
            )->groupBy("id")->orderBy("earning", "desc")->get();
        $dataX = [];
        $dataY = [];
        foreach ($allUsers as $key => $value) {
            array_push($dataX, $value->name);
            array_push($dataY, $value->earning);
        }
        return ["dataX" => $dataX, "dataY" => $dataY, "users" => $allUsers];
    }
    //users turnover 
    public function usersTurnover($filterData)
    {
        $users = User::leftJoin('orders', 'users.id', '=', 'orders.user_id')
            ->leftJoin(
                'details_orders',
                'details_orders.order_id',
                '=',
                'orders.id'
            )
            ->whereBetween('orders.created_at', $filterData["filter"])
            ->select(
                // DB::raw($filterData["filterType"]),
                "users.id as id",
                "users.name as name",
                "users.picture as picture",
                DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                DB::raw('IFNULL(SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100)),0) as turnover')
            )
            ->groupBy("id")
            ->orderBy("turnover", "desc")
            ->get();
        $dataX = [];
        $dataY = [];
        foreach ($users as $value) {
            array_push($dataX, $value->name);
            array_push($dataY, $value->turnover);
        }
        return ["dataX" => $dataX, "dataY" => $dataY, "users" => $users];
    }
    //get customers statistics
    public function customers($filterData)
    {
        $customers = Customer::join('orders', 'customers.id', '=', 'orders.customer_id')
            ->join('details_orders', 'details_orders.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', $filterData["filter"])
            ->select(
                DB::raw("customers.id as id"),
                DB::raw("customers.name as name"),
                DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
            )
            ->groupBy("id")
            ->orderBy("turnover", "desc")
            ->get();
        $dataX = [];
        $dataY = [];
        foreach ($customers as $value) {
            array_push($dataX, $value->name);
            array_push($dataY, $value->turnover);
        }
        return ["dataX" => $dataX, "dataY" => $dataY, "customers" => $customers];
    }
    //supplier
    public function suppliers($filterData)
    {
        $suppliers = Supplier::join("purchases", "suppliers.id", "=", "purchases.supplier_id")
            ->join("stocks", "purchases.id", "=", "stocks.purchase_id")
            ->join("users", "purchases.user_id", "=", "users.id")
            ->whereBetween('purchases.created_at', $filterData["filter"])
            ->select(
                DB::raw('suppliers.id as id'),
                DB::raw('suppliers.name as name'),
                DB::raw('SUM(stocks.stock_init) as qnt'),
                DB::raw('SUM((stocks.price * stocks.stock_init)) as turnover')
            )
            ->groupBy("id")
            ->orderBy("turnover", "desc")
            ->get();
        $dataX = [];
        $dataY = [];
        foreach ($suppliers as $value) {
            array_push($dataX, $value->name);
            array_push($dataY, $value->turnover);
        }
        return ["dataX" => $dataX, "dataY" => $dataY, "suppliers" => $suppliers];
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Details_order;
use App\Models\Details_return;
use App\Models\Order;
use App\Models\Printer;
use App\Models\Returns;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Error;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Validation\Rule;
use Mike42\Escpos\PrintConnectors\NetworkPrintConnector;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\Printer as EscposPrinter;
use Mike42\Escpos\EscposImage;
use Monolog\Handler\PushoverHandler;
use Psr\Http\Message\ResponseInterface;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response as ResponseFacades;
use App\Mail\SaleInvoiceMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;
class OrderController extends Controller
{
    /**
     * create order
     */
    public function create(Request $request){
        try{
            //validate fields
            $validateFields = $request->validate([
                "customer" => "required",
                "orderType" => [
                    "required",
                    Rule::in(["retail", "wholesale"])
                ],
                "amountProvided"=>"required",
                "tax" => "required",
                "cartItems" => "required|array",
                "cartItems.*.product" => "required",
                "cartItems.*.qnt" => "required|integer",
            ]);
            //get the logged user 
            $user = Auth::user();
            //check products stock 
            $product = new ProductController();
            foreach ($validateFields["cartItems"] as $item) {
                $product->checkStock($item["product"]["id"], $item["qnt"]);
            }
            if ($user->cashier) {
                //create order
                $order = Order::create([
                    "type" => $validateFields["orderType"],
                    "payed_margin" => 0,
                    "amountProvided" => $validateFields["amountProvided"],
                    "tax" => $validateFields["tax"],
                    "customer_id" => $validateFields["customer"],
                    "user_id" => $user->id,
                    "status" => "delivered",
                    "delivered_by" => $user->id,
                    "delivered_at" => Carbon::now()
                ]);
            } else {
                //create order
                $order = Order::create([
                    "type" => $validateFields["orderType"],
                    "payed_margin" => 0,
                    "amountProvided" => $validateFields["amountProvided"],
                    "tax" => $validateFields["tax"],
                    "customer_id" => $validateFields["customer"],
                    "user_id" => $user->id,
                ]);
            }
            //create details order
            $details_order = new DetailsOrderController(); 
            foreach($validateFields["cartItems"] as $ligne){
                $dataLigne = [
                    "qnt"=>$ligne["qnt"],
                    "discount"=>$ligne["product"]["discount"],
                    "id_product"=> $ligne["product"]["id"]
                ];
                $details_order->addLigne($order, $dataLigne);
            }
            //return response
            return response(["message" => "Order Saved with success", "data" => $order->customer], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message"=>$err->getMessage()],Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     *save and print order
     * @todo create order normally
     * @todo check if the cashier mode active 
     * @todo if yes: get user printer and print invoice in pos printer
     * @todo if no: generate an pdf and return it to the user 
     */
    public function createPrint(Request $request)
    {
        try {
            //validate fields
            $validateFields = $request->validate([
                "customer" => "required",
                "orderType" => [
                    "required",
                    Rule::in(["retail", "wholesale"])
                ],
                "amountProvided" => "required",
                "tax" => "required",
                "cartItems" => "required|array",
                "cartItems.*.product" => "required",
                "cartItems.*.qnt" => "required|integer",
            ]);
            //get the logged user 
            $user = Auth::user();
            //check products stock 
            $product = new ProductController();
            foreach ($validateFields["cartItems"] as $item) {
                $product->checkStock($item["product"]["id"], $item["qnt"]);
            }
            if ($user->cashier) {
                //create order
                $order = Order::create([
                    "type" => $validateFields["orderType"],
                    "payed_margin" => 0,
                    "amountProvided" => $validateFields["amountProvided"],
                    "tax" => $validateFields["tax"],
                    "customer_id" => $validateFields["customer"],
                    "user_id" => $user->id,
                    "status" => "delivered",
                    "delivered_by" => $user->id,
                    "delivered_at" => Carbon::now()
                ]);
            } else {
                //create order
                $order = Order::create([
                    "type" => $validateFields["orderType"],
                    "payed_margin" => 0,
                    "amountProvided" => $validateFields["amountProvided"],
                    "tax" => $validateFields["tax"],
                    "customer_id" => $validateFields["customer"],
                    "user_id" => $user->id,
                ]);
            }
            //create details order
            $details_order = new DetailsOrderController();
            foreach ($validateFields["cartItems"] as $ligne) {
                $dataLigne = [
                    "qnt" => $ligne["qnt"],
                    "discount" => $ligne["product"]["discount"],
                    "id_product" => $ligne["product"]["id"]
                ];
                $details_order->addLigne($order, $dataLigne);
            }
            
            if ($user->cashier) {
                //get printer
                if (!empty($user->printer)) {
                    try {
                        if ($user->printer->network) {
                            //network printer
                            $this->networkPrintInvoice($order, $user->printer);
                        } else {
                            //local printer
                            $this->localPrintInvoice($order, $user->printer);
                        }
                    } catch (Exception $err) {
                        $this->remove($order);
                        throw new Exception($err->getMessage());
                    }
                } else {
                    $this->remove($order);
                    throw new Exception("Set up printer");
                }
            } else {
                //it mean this user is seller
                $invoice = $this->generateInvoicePdf($order);
                $pdfBase64 = base64_encode($invoice);
                // return $invoice;
                return response(["message" => "Order Saved with success", "data" => $pdfBase64], Response::HTTP_OK);
            }
            //return response
            return response(["message" => "Order Saved with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }


    /**
     * get pending orders
     * @desc get all pending orders
     * @todo get all orders joined with detailsOrders and product group by users 
     * and product and count qnt of each product 
     */
    public function getPending()
    {
        try {
            $orders = Order::join("details_orders", "orders.id", "=", "details_orders.order_id")
            ->join("products", "products.id", "=", "details_orders.product_id")
            ->join("users", "orders.user_id", "=", "users.id")
            ->where("orders.status", "=", "pending")
            ->where("details_orders.status", "=", "pending")
            ->select(
                "users.name as user",
                "users.id as user_id",
                DB::raw('ROW_NUMBER() OVER (ORDER BY users.name) as unique_id'),
                DB::raw('products.id as product_id'),
                DB::raw('products.barcode as barcode'),
                DB::raw('products.name as product'),
                DB::raw('SUM(details_orders.qnt) as qnt')
            )
                ->groupBy("product_id", "user_id")
                ->orderBy('user')
                ->get();
            return response(["message" => "success", "data" => $orders], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * set redy order
     * @todo get data sent by front side
     * @todo set ready for a specific user and product
     */
    public function setReady(Request $request)
    {
        try {
            $validateFields = $request->validate([
                "user" => "required|integer",
                "barcode" => "required"
            ]);
            Order::join("details_orders", "orders.id", "=", "details_orders.order_id")
            ->join("products", "products.id", "=", "details_orders.product_id")
            ->join("users", "orders.user_id", "=", "users.id")
            ->where("orders.status", "=", "pending")
            ->where("details_orders.status", "=", "pending")
            ->where("users.id", "=", $validateFields["user"])
            ->where("products.barcode", "=", $validateFields["barcode"])
            ->update([
                "details_orders.status" => "ready"
            ]);
            return $this->getPending();
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * set all ready 
     * @todo set all order ready
     */
    public function setAllReady(Request $request)
    {
        try {
            $userIds = $request->input('users', []); // array of user IDs

            // Safety check: only run if array is not empty
            if (empty($userIds)) {
                return response(["message" => "No users selected"], Response::HTTP_BAD_REQUEST);
            }
            
            Order::join("details_orders", "orders.id", "=", "details_orders.order_id")
            ->join("products", "products.id", "=", "details_orders.product_id")
            ->join("users", "orders.user_id", "=", "users.id")
            ->where("orders.status", "pending")
            ->where("details_orders.status", "pending")
            ->whereIn("orders.user_id", $userIds) 
            ->update([
                "details_orders.status" => "ready"
            ]);
            return response(["message" => "success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function setDelivered(Request $request)
    {
        try {
            $id = $request->route("id");
            $user = Auth::user();
            $order = Order::find($id);
            if ($order->status != "delivered") {
                $order->update([
                    "status" => "delivered",
                    "delivered_by" => $user->id,
                    "delivered_at" => Carbon::now()
                ]);
            } else {
                throw new Exception("Order already Delivered");
            }
            return response(["message" => "success", "data" => $order], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function setPending(Request $request)
    {
        try {
            $id = $request->route("id");
            $order = Order::find($id);
            $order->update([
                "status" => "pending",
                "delivered_by" => 0,
            ]);
            return response(["message" => "success", "data" => $order], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * get all orders
     * @todo get all sales 
     * @todo get sales statistic
     * @todo filter by date and user
     */
    public function getAll(Request $request)
    {
        try {
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => "",
                "user" => "numeric"
            ]);
            $filterData = $this->filterData($validateFields, "orders.created_at");
            //get sales
            $sales = [];
            $statistics = [];
            if ($validateFields["user"] != -1) {
                $sales = Order::join(
                    'details_orders',
                    'details_orders.order_id',
                    '=',
                    'orders.id'
                )
                    ->join(
                        'customers',
                        'orders.customer_id',
                        "=",
                        "customers.id"
                    )
                    ->join(
                        'users',
                        'orders.user_id',
                        "=",
                        "users.id"
                    )
                    ->where(
                        'orders.user_id',
                        '=',
                        $validateFields["user"]
                    )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        // DB::raw($filterData["filterType"]),
                        DB::raw('orders.id as id'),
                    DB::raw('DATE_FORMAT(orders.created_at,"%d-%m-%Y %H:%i") as date'),
                        DB::raw('customers.name as customer'),
                        DB::raw('users.name as user'),
                        DB::raw('orders.type as type'),
                        DB::raw('orders.status as status'),
                    DB::raw('orders.tax as tax'),
                        DB::raw('SUM(details_orders.qnt) as qnt'),
                        DB::raw('SUM(details_orders.price * details_orders.qnt * details_orders.discount / 100) as discount'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as total')
                    )
                    ->groupBy("id")
                    ->orderBy('date')
                    ->get();
                $returns = Returns::join(
                    'details_returns',
                    'details_returns.return_id',
                    '=',
                    'returns.id'
                )
                ->join(
                    'orders',
                    'returns.order_id',
                    "=",
                    "orders.id"
                )
                ->join(
                    'users',
                    'orders.user_id',
                    "=",
                    "users.id"
                )
                ->where(
                    'orders.user_id',
                    '=',
                    $validateFields["user"]
                )
                ->whereBetween('orders.created_at', $filterData["filter"])
                ->select(
                    DB::raw('returns.id as id'),
                    DB::raw('orders.id as sale_id'),
                    DB::raw('returns.created_at as created_at'),
                    DB::raw('users.name as user'),
                    DB::raw('SUM(details_returns.qnt) as qnt'),
                    DB::raw('SUM(details_returns.price * details_returns.qnt * details_returns.discount / 100) as discount'),
                    DB::raw('SUM((details_returns.price * details_returns.qnt) - (details_returns.price * details_returns.qnt * details_returns.discount / 100) ) as total')
                )
                ->groupBy("id")
                ->orderBy('created_at')
                ->get();
                
                //get statistics
                $statistics = Order::join(
                    'details_orders',
                    'details_orders.order_id',
                    '=',
                    'orders.id'
                )->where(
                    'orders.user_id',
                    '=',
                    $validateFields["user"]
                )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                    )
                    ->groupBy("orders.user_id")
                    ->get();
            } else {
                $sales = Order::join(
                    'details_orders',
                    'details_orders.order_id',
                    '=',
                    'orders.id'
                )
                    ->join(
                        'customers',
                        'orders.customer_id',
                        "=",
                        "customers.id"
                    )
                    ->join(
                        'users',
                        'orders.user_id',
                        "=",
                        "users.id"
                    )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                    DB::raw("DATE_FORMAT(orders.created_at,'%d-%m-%Y %H:%i') as date"),
                        DB::raw('orders.id as id'),
                        DB::raw('customers.name as customer'),
                        DB::raw('users.name as user'),
                        DB::raw('orders.type as type'),
                    DB::raw('orders.tax as tax'),
                        DB::raw('orders.status as status'),
                        DB::raw('SUM(details_orders.qnt) as qnt'),
                        DB::raw('SUM(details_orders.price * details_orders.qnt * details_orders.discount / 100) as discount'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as total')
                    )
                    ->groupBy("id")
                    ->orderBy('date')
                    ->get();
                $returns = Returns::join(
                    'details_returns',
                    'details_returns.return_id',
                    '=',
                    'returns.id'
                )
                ->join(
                    'orders',
                    'returns.order_id',
                    "=",
                    "orders.id"
                )
                    ->join(
                        'users',
                        'orders.user_id',
                        "=",
                        "users.id"
                    )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        DB::raw('returns.id as id'),
                        DB::raw('orders.id as sale_id'),
                        DB::raw('returns.created_at as created_at'),
                        DB::raw('users.name as user'),
                        DB::raw('SUM(details_returns.qnt) as qnt'),
                        DB::raw('SUM(details_returns.price * details_returns.qnt * details_returns.discount / 100) as discount'),
                        DB::raw('SUM((details_returns.price * details_returns.qnt) - (details_returns.price * details_returns.qnt * details_returns.discount / 100) ) as total')
                    )
                    ->groupBy("id")
                    ->orderBy('created_at')
                    ->get();
                $statistics = Order::join(
                    'details_orders',
                    'details_orders.order_id',
                    '=',
                    'orders.id'
                )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                    )
                    // ->groupBy("orders.user_id")
                    ->get();

            }
            if (empty($statistics[0]->turnover)) {
                $statistics[0] = collect(["order_count" => 0, "turnover" => 0]);
            }
            $updatedSales = array_map(function ($item) use ($returns) {
                $item["return_qnt"] = 0;
                foreach ($returns->toArray() as $elem) {
                    if (
                        $item["id"] == $elem["sale_id"]
                    ) {
                        $item["return_qnt"] = $elem["qnt"];
                        break;
                    }
                }
                return $item;
            }, $sales->toArray());
            return response(["message" => "success", "data" => collect(["sales" => $updatedSales, "statistics" => $statistics[0]])], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getAllCurrentUser(Request $request)
    {
        try {
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => ""
            ]);
            $user = Auth::user();
            $filterData = $this->filterData($validateFields, "orders.created_at");
            //get sales
            $sales = [];
            $statistics = [];
            $sales = Order::join(
                'details_orders',
                'details_orders.order_id',
                '=',
                'orders.id'
            )
                ->join(
                    'customers',
                    'orders.customer_id',
                    "=",
                    "customers.id"
                )
                ->join(
                    'users',
                    'orders.user_id',
                    "=",
                    "users.id"
                )
                ->where(
                    'orders.user_id',
                    '=',
                    $user->id
                )
                ->whereBetween('orders.created_at', $filterData["filter"])
                ->select(
                    // DB::raw($filterData["filterType"]),
                    DB::raw('orders.id as id'),
                DB::raw("DATE_FORMAT(orders.created_at,'%d-%m-%Y %H:%i') as date"),
                    DB::raw('customers.name as customer'),
                    DB::raw('users.name as user'),
                    DB::raw('orders.type as type'),
                    DB::raw('orders.status as status'),
                DB::raw('orders.tax as tax'),
                    DB::raw('SUM(details_orders.qnt) as qnt'),
                    DB::raw('SUM(details_orders.price * details_orders.qnt * details_orders.discount / 100) as discount'),
                    DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as total')
                )
                ->groupBy("id")
                ->orderBy('date')
                ->get();
            $returns = Returns::join(
                'details_returns',
                'details_returns.return_id',
                '=',
                'returns.id'
            )
                ->join(
                    'orders',
                    'returns.order_id',
                    "=",
                    "orders.id"
                )
                ->join(
                    'users',
                    'orders.user_id',
                    "=",
                    "users.id"
                )
                ->where(
                    'orders.user_id',
                    '=',
                    $user->id
                )
                ->whereBetween('orders.created_at', $filterData["filter"])
                ->select(
                    DB::raw('returns.id as id'),
                    DB::raw('orders.id as sale_id'),
                    DB::raw('returns.created_at as created_at'),
                    DB::raw('users.name as user'),
                    DB::raw('SUM(details_returns.qnt) as qnt'),
                    DB::raw('SUM(details_returns.price * details_returns.qnt * details_returns.discount / 100) as discount'),
                    DB::raw('SUM((details_returns.price * details_returns.qnt) - (details_returns.price * details_returns.qnt * details_returns.discount / 100) ) as total')
                )
                ->groupBy("id")
                ->orderBy('created_at')
                ->get();

            //get statistics
            $statistics = Order::join(
                'details_orders',
                'details_orders.order_id',
                '=',
                'orders.id'
            )->where(
                'orders.user_id',
                '=',
                $user->id
            )
                ->whereBetween('orders.created_at', $filterData["filter"])
                ->select(
                    DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                    DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                )
                ->groupBy("orders.user_id")
                ->get();
            if (empty($statistics[0]->turnover)) {
                $statistics[0] = collect(["order_count" => 0, "turnover" => 0]);
            }
            $updatedSales = array_map(function ($item) use ($returns) {
                $item["return_qnt"] = 0;
                foreach ($returns->toArray() as $elem) {
                    if (
                        $item["id"] == $elem["sale_id"]
                    ) {
                        $item["return_qnt"] = $elem["qnt"];
                        break;
                    }
                }
                return $item;
            }, $sales->toArray());
            return response(["message" => "success", "data" => collect(["sales" => $updatedSales, "statistics" => $statistics[0]])], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @desc delete a sale
     * @param Request $request
     * @todo get the sale {id}
     * @todo return qnt to the stock (not now)
     * @todo delete details order
     * @todo delete order 
     */
    public function delete(Request $request)
    {
        try {
            $id = $request->route("id");
            $order = Order::find($id);
            $order->details_order()->delete();
            $order->delete();
            return response(["message" => "deleted with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @param Request (filter , user, startDate, endDate)
     * @desc send report to the report mail
     * @todo get the e-mail from app setting file 
     * @todo prepare html file to send 
     * @todo set data in the file 
     * @todo send using smtp protocol
     * @todo return success message
     */
    public function sendReport(Request $request)
    {
        try {
            //sending 
            //get param
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => "",
                "user" => "numeric"
            ]);

            return response(["message" => "send with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @param Request (id)
     * @desc get data for single page sale
     * @todo get id
     * @todo find order
     * @todo get details order
     * @todo get infos (id,user,customer,phone,adresse,qnt,discount,cachierMargin,type,status,totalTTC,date)
     */
    public function getSingle(Request $request)
    {
        try {
            $id = $request->route("id");
            $details_order = Order::join(
                'details_orders',
                'details_orders.order_id',
                '=',
                'orders.id'
            )
                ->join(
                    'products',
                    'details_orders.product_id',
                    "=",
                    "products.id"
                )
                ->where(
                    'orders.id',
                    '=',
                    $id
                )
                ->select(
                DB::raw('details_orders.id as id'),
                DB::raw("DATE_FORMAT(orders.created_at,'%d-%m-%Y %H:%i') as date"),
                    DB::raw('products.barcode as barcode'),
                    DB::raw('products.name as product'),
                    DB::raw('details_orders.qnt as qnt'),
                    DB::raw('details_orders.price as unitPrice'),
                    DB::raw('details_orders.margin as cachierMargin'),
                    DB::raw('details_orders.discount as discount'),
                    DB::raw('((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100))  as total')
                )
                ->get();

            $orderInfo = Order::join(
                'details_orders',
                'details_orders.order_id',
                '=',
                'orders.id'
            )
                ->join(
                    'customers',
                    'orders.customer_id',
                    "=",
                    "customers.id"
                )
                ->join(
                    'users',
                    'orders.user_id',
                    "=",
                    "users.id"
                )
                ->where(
                    'orders.id',
                    '=',
                    $id
                )
                ->select(
                    DB::raw('orders.id as id'),
                DB::raw("DATE_FORMAT(orders.created_at,'%d-%m-%Y %H:%i') as date"),
                    DB::raw('customers.name as customer'),
                    DB::raw('customers.phone as phone'),
                    DB::raw('customers.adresse as adresse'),
                    DB::raw('users.name as user'),
                    DB::raw('orders.type as type'),
                    DB::raw('orders.status as status'),
                DB::raw('orders.tax as tax'),
                    DB::raw('SUM(details_orders.qnt) as qnt'),
                    DB::raw('SUM(details_orders.margin) as cachierMargin'),
                    DB::raw('SUM(details_orders.price * details_orders.qnt * details_orders.discount / 100) as discount'),
                    DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as total')
                )->groupBy("id")
                ->get();
            $orderInfo[0]->details_order = $details_order;
            return response(["message" => "send with success", "data" => $orderInfo[0]], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     *  @desc get details order for edit page
     * @todo check if the order delivred or not yet
     * @todo if yes the user must be admin
     * @todo get details order
     * 
        {
            product: {
                id:res.products[0].id,
                codebar: res.products[0].barcode,
                name: res.products[0].name,
                retailPrice: res.products[0].retail_price,
                wholesalePrice: res.products[0].wholesales_price,
                discount: res.products[0].discount,
                maxQnt:res.products[0].maxQnt, 
            },
            qnt: 1
        }  
     */
    public function getEditOrder(Request $request)
    {
        try {
            $id = $request->route("id");
            $order = Order::find($id);
            $user = Auth::user();
            $userController = new UserController();
            if (!$userController->isAdmin($user->id)) {
                if (!$userController->isAdmin($user->id) && $order->status != "pending") {
                    throw new Error("Order already delivered");
                } else if ($order->status != "pending" && $order->user_id != $user->id) {
                    throw new Error("none authorized");
                }
            }
            //get details order
            $orderData = Order::join(
                'details_orders',
                'details_orders.order_id',
                '=',
                'orders.id'
            )
                ->join(
                    'products',
                    'details_orders.product_id',
                    "=",
                    "products.id"
                )
                ->join(
                    "stocks",
                    "stocks.product_id",
                    "=",
                    "products.id"
                )
                ->where(
                    'orders.id',
                    '=',
                    $id
                )
                // ->select("*")
                ->select(
                    DB::raw('products.id as id'),
                    DB::raw('orders.customer_id as customer'),
                    DB::raw('orders.type as orderType'),
                    DB::raw('details_orders.id as deId'),
                    DB::raw('products.barcode as codebar'),
                    DB::raw('products.name as name'),
                    DB::raw('products.retail_price as retailPrice'),
                    DB::raw('products.wholesales_price as wholesalePrice'),
                    DB::raw('details_orders.discount as discount'),
                    DB::raw('details_orders.qnt as qnt'),
                    DB::raw('SUM(stocks.stock_actuel) as maxQnt'),
                )
                ->groupBy("id", "deId")
                ->get();
            $data = [];
            foreach ($orderData as $item) {
                array_push(
                    $data,
                    collect([
                        "product" => collect([
                            "id" => $item->id,
                            "codebar" => $item->codebar,
                            "name" => $item->name,
                            "retailPrice" => $item->retailPrice,
                            "wholesalePrice" => $item->wholesalePrice,
                            "discount" => $item->discount,
                            "maxQnt" => $item->maxQnt,
                        ]),
                        "qnt" => $item->qnt
                    ])
                );
            }
            $data = collect([
                "cartItems" => $data,
                "customer" => $order->customer->id,
                "orderType" => $order->type
            ]);
            return response(["message" => "send with success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @desc update order
     * @todo get the order
     * @todo check if user type and order status
     * @todo return the old details order to the stock
     * @todo set the new details order
     * @todo update order infos
     * @todo return success msg
     */
    public function updateOrder(Request $request)
    {
        try {
            $validateFields = $request->validate([
                "customer" => "required",
                "orderType" => [
                    "required",
                    Rule::in(["retail", "wholesale"])
                ],
                "amountProvided" => "required",
                "cartItems" => "required|array",
                "cartItems.*.product" => "required",
                "cartItems.*.qnt" => "required|integer",
            ]);
            $id = $request->route("id");
            $order = Order::find($id);
            if (empty($order)) {
                throw new Error("Something wrrong");
            }
            //check user
            $user = Auth::user();
            $userController = new UserController();
            if (!$userController->isAdmin($user->id)) {
                if (!$userController->isAdmin($user->id) && $order->status != "pending") {
                    throw new Error("Order already delivered");
                } else if ($order->status != "pending" && $order->user_id != $user->id) {
                    throw new Error("none authorized");
                }
            }
            //return old details to the stock
            /**
             * @todo loop the details_order
             * @todo check if product stockManage active
             * @todo call returnLine function 
             * @todo delete line
             */
            $details_order = new DetailsOrderController();
            foreach ($order->details_order as $item) {
                if ($item->product->enable_stock == 1) {
                    //handle return 
                    $details_order->returnLine($item);
                }
                //delete line
                $item->delete();
            }
            //set new details order
            $product = new ProductController();
            foreach ($validateFields["cartItems"] as $item) {
                $product->checkStock($item["product"]["id"], $item["qnt"]);
            }
            foreach ($validateFields["cartItems"] as $ligne) {
                $dataLigne = [
                    "qnt" => $ligne["qnt"],
                    "discount" => $ligne["product"]["discount"],
                    "id_product" => $ligne["product"]["id"]
                ];
                $details_order->addLigne($order, $dataLigne);
            }
            //update order infos
            $order->update([
                "type" => $validateFields["orderType"],
                "amountProvided" => $validateFields["amountProvided"],
                "customer_id" => $validateFields["customer"]
            ]);

            return response(["message" => "order updated with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @desc return sale
     * @todo get the sales id 
     * @todo check if the sale has return
     * @todo if not get the details_sales with return_qnt=0 
     */
    public function saleReturn(Request $request)
    {
        try {
            $id = $request->route('id');
            $order = Order::find($id);
            $details_order = Order::join(
                'details_orders',
                'details_orders.order_id',
                '=',
                'orders.id'
            )
                ->join(
                    'products',
                    'details_orders.product_id',
                    "=",
                    "products.id"
                )
                ->where(
                    'orders.id',
                    '=',
                    $id
                )
                ->select(
                    DB::raw('details_orders.id as id'),
                DB::raw('DATE_FORMAT(orders.created_at,"%d-%m-%Y %H:%i") as date'),
                    DB::raw('products.barcode as barcode'),
                DB::raw('products.id as product_id'),
                    DB::raw('products.name as product'),
                    DB::raw('details_orders.qnt as qnt'),
                    DB::raw('details_orders.price as unitPrice'),
                    DB::raw('details_orders.margin as cachierMargin'),
                    DB::raw('details_orders.discount as discount'),
                    DB::raw('((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100))  as total')
                )
                ->get();
            if ($order->returns->count() == 0) {
                $updatedData = array_map(function ($item) {
                    $item["return_qnt"] = 0;
                    return $item;
                }, $details_order->toArray());
                return response(["message" => "order empty", "data" => $updatedData], Response::HTTP_OK);
            } else {
                /**
                 * change return_qnt for product returned
                 */
                $updatedData = array_map(function ($item) use ($order) {
                    $retrun_qnt = 0;
                    foreach ($order->returns[0]->details_returns as $returnLine) {
                        if ($returnLine->product_id == $item["product_id"]) {
                            $retrun_qnt = $returnLine->qnt;
                            break;
                        }
                    }
                    $item["return_qnt"] = $retrun_qnt;
                    return $item;
                }, $details_order->toArray());
                return response(["message" => "Not Empty", "data" => $updatedData], Response::HTTP_OK);
            }
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * return sale
     * @todo validate data
     * @todo get the order
     * @todo check if order returns is empty
     * @todo if order returns empty
     *      @todo create new return 
     *      @todo add details return
     * @todo else
     *      @todo delete old details order
     *      @todo create new details order
     */
    public function updateReturn(Request $request, Order $order)
    {
        try {
            $validateFields = $request->validate([
                "details_returns" => "array"
            ]);
            $user = Auth::user();
            if ($order->returns->count() == 0) {
                //here for create
                if (empty($validateFields["details_returns"])) {
                    return response(["message" => "No data sent"], Response::HTTP_OK);
                } else {
                    $return = Returns::create([
                        "order_id" => $order->id,
                        "user_id" => $user->id,
                    ]);
                    $details_return = new DetailsReturnController();
                    foreach ($validateFields["details_returns"] as $line) {
                        $details_return->addLine($return, $line);
                    }
                }
            } else {
                if (empty($validateFields["details_returns"])) {
                    foreach ($order->returns[0]->details_returns as $line) {
                        $line->delete();
                    }
                    $order->returns()->delete();
                } else {
                    foreach ($order->returns[0]->details_returns as $line) {
                        $line->delete();
                    }
                    $details_return = new DetailsReturnController();
                    foreach ($validateFields["details_returns"] as $line) {
                        $details_return->addLine($order->returns[0], $line);
                    }
                }
            }
            return response(["message" => "return added with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            throw new Exception($err->getMessage());
        }
    }
    /**
     * create or update save 
     */
    public function saveReturn(Request $request)
    {
        try {
            $id = $request->route("id");
            $order = Order::find($id);
            return $this->updateReturn($request, $order);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get all sales to delivered for a user who has delivered role
     * and sectors 
     */
    public function getOrdersToDelivery(Request $request)
    {
        try {
            //get user
            $user = Auth::user();
            $pendingOrders = Order::whereHas('customer.sector.users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
                ->where('status', 'pending')
                ->with(['customer.sector' => function ($query) {
                    $query->select('id', 'title'); // Select only necessary fields from the sector
                }])
                ->with(['customer.sector.users' => function ($query) use ($user) {
                    $query->where('users.id', $user->id);
                    $query->select('users.id', 'users.name'); // Select only necessary fields from the users
                }])
                ->with(['customer' => function ($query) {
                    $query->select('id', 'name', 'sector_id', "picture"); // Select only necessary fields from the customer
                }])
                ->with(['customer' => function ($query) {
                    $query->select('id', 'name', 'sector_id', "picture"); // Select only necessary fields from the customer
                }])
                ->withSum(['details_order as total' => function ($query) {
                    $query->select(DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100))'));
                }], 'price') // Calculate the total for each order
                ->withSum(['details_order as discount' => function ($query) {
                    $query->select(DB::raw('SUM((details_orders.price * details_orders.qnt * details_orders.discount / 100))'));
                }], 'price') // Calculate the total for each order
                ->withSum(['details_order as qnt' => function ($query) {
                    $query->select(DB::raw('SUM(details_orders.qnt)'));
                }], 'qnt') // Calculate the total for each order
                ->addSelect('orders.*', DB::raw('DATE_FORMAT(orders.created_at,"%d-%m-%Y %H:%i") as date'))
                ->get();
            return response(["message" => "success", "data" => $pendingOrders], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get one order information for delivery section
     * 
     */
    public function getOneOrderToDelivery(Request $request)
    {
        try {
            $idOrder = $request->route("id");
            $user = Auth::user();
            $order = Order::whereHas('customer.sector.users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
                ->where('status', 'pending')
                ->where('id', $idOrder)
                ->with(['customer.sector' => function ($query) {
                    $query->select('id', 'title'); // Select only necessary fields from the sector
                }])
                ->with(['customer.sector.users' => function ($query) use ($user) {
                    $query->where('users.id', $user->id);
                    $query->select('users.id', 'users.name'); // Select only necessary fields from the users
                }])
                ->with(['customer' => function ($query) {
                    $query->select('id', 'name', 'sector_id', "picture", "adresse", "phone"); // Select only necessary fields from the customer
                }])
                ->with(['details_order.product'])
                ->withSum(['details_order as total' => function ($query) {
                    $query->select(DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100))'));
                }], 'price') // Calculate the total for each order
                ->withSum(['details_order as discount' => function ($query) {
                    $query->select(DB::raw('SUM((details_orders.price * details_orders.qnt * details_orders.discount / 100))'));
                }], 'price') // Calculate the total for each order
                ->withSum(['details_order as qnt' => function ($query) {
                    $query->select(DB::raw('SUM(details_orders.qnt)'));
                }], 'qnt') // Calculate the total for each order
                ->addSelect('orders.*', DB::raw('DATE_FORMAT(orders.created_at,"%d-%m-%Y %H:%i") as date'))
                ->get();
            return response(["message" => "success", "data" => $order[0]], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getOneOrderDelivered(Request $request)
    {
        try {
            $idOrder = $request->route("id");
            $user = Auth::user();
            $order = Order::whereHas('customer.sector.users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
                ->where('status', 'delivered')
                ->where('id', $idOrder)
                ->with(['customer.sector' => function ($query) {
                    $query->select('id', 'title'); // Select only necessary fields from the sector
                }])
                ->with(['customer.sector.users' => function ($query) use ($user) {
                    $query->where('users.id', $user->id);
                    $query->select('users.id', 'users.name'); // Select only necessary fields from the users
                }])
                ->with(['customer' => function ($query) {
                $query->select('id', 'name', 'sector_id', "picture", "adresse", "phone"); // Select only necessary fields from the customer
            }])
                ->with(['details_order.product'])
                ->withSum(['details_order as total' => function ($query) {
                    $query->select(DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100))'));
                }], 'price') // Calculate the total for each order
                ->withSum(['details_order as discount' => function ($query) {
                    $query->select(DB::raw('SUM((details_orders.price * details_orders.qnt * details_orders.discount / 100))'));
                }], 'price') // Calculate the total for each order
                ->withSum(['details_order as qnt' => function ($query) {
                    $query->select(DB::raw('SUM(details_orders.qnt)'));
                }], 'qnt') // Calculate the total for each order
                ->addSelect('orders.*', DB::raw('DATE_FORMAT(orders.delivered_at,"%d-%m-%Y %H:%i") as delivered_at'))
                ->get();
            return response(["message" => "success", "data" => $order[0]], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get delivered orders
     */
    public function getOrdersDelivered(Request $request)
    {
        try {
            //get orders
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => ""
            ]);
            $user = Auth::user();
            $filterData = $this->filterData($validateFields, "orders.created_at");
            //get sales
            $sales = [];
            $sales = Order::join(
                'details_orders',
                'details_orders.order_id',
                '=',
                'orders.id'
            )
                ->join(
                    'customers',
                    'orders.customer_id',
                    "=",
                    "customers.id"
                )
                ->join(
                    'users',
                    'orders.delivered_by',
                    "=",
                    "users.id"
                )
                ->where(
                    'orders.delivered_by',
                    '=',
                    $user->id
                )
                ->whereBetween('orders.delivered_at', $filterData["filter"])
                ->select(
                    // DB::raw($filterData["filterType"]),
                    DB::raw('orders.id as id'),
                    DB::raw("DATE_FORMAT(orders.delivered_at,'%d-%m-%Y %H:%i') as date"),
                    DB::raw('customers.name as customer'),
                    DB::raw('users.name as user'),
                    DB::raw('orders.type as type'),
                    DB::raw('orders.status as status'),
                    DB::raw('orders.tax as tax'),
                    DB::raw('SUM(details_orders.qnt) as qnt'),
                    DB::raw('SUM(details_orders.price * details_orders.qnt * details_orders.discount / 100) as discount'),
                    DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as total')
                )
                ->groupBy("id")
                ->orderBy('date')
                ->get();
            $returns = Returns::join(
                'details_returns',
                'details_returns.return_id',
                '=',
                'returns.id'
            )
                ->join(
                    'orders',
                    'returns.order_id',
                    "=",
                    "orders.id"
                )
                ->join(
                    'users',
                    'orders.delivered_by',
                    "=",
                    "users.id"
                )
                ->where(
                    'orders.delivered_by',
                    '=',
                    $user->id
                )
                ->whereBetween('orders.delivered_at', $filterData["filter"])
                ->select(
                    DB::raw('returns.id as id'),
                    DB::raw('orders.id as sale_id'),
                    DB::raw('returns.created_at as created_at'),
                    DB::raw('users.name as user'),
                    DB::raw('SUM(details_returns.qnt) as qnt'),
                    DB::raw('SUM(details_returns.price * details_returns.qnt * details_returns.discount / 100) as discount'),
                    DB::raw('SUM((details_returns.price * details_returns.qnt) - (details_returns.price * details_returns.qnt * details_returns.discount / 100) ) as total')
                )
                ->groupBy("id")
                ->orderBy('created_at')
                ->get();
            $updatedSales = array_map(function ($item) use ($returns) {
                $item["return_qnt"] = 0;
                foreach ($returns->toArray() as $elem) {
                    if (
                        $item["id"] == $elem["sale_id"]
                    ) {
                        $item["return_qnt"] = $elem["qnt"];
                        break;
                    }
                }
                return $item;
            }, $sales->toArray());
            return response(["message" => "success", "data" => $updatedSales], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * set delivered by delivery men
     */
    public function setDeliveredByUser(Request $request)
    {
        try {
            $id = $request->route("id");
            $user = Auth::user();
            $order = Order::whereHas('customer.sector.users', function ($query) use ($user) {
                $query->where('users.id', $user->id);
            })
                ->where('status', 'pending')
                ->where('id', $id)
                ->with(['customer.sector.users' => function ($query) use ($user) {
                    $query->where('users.id', $user->id);
                }])
                ->get();
            if (empty($order)) {
                throw new Exception("not allow");
            }
            $order = Order::find($id);
            if ($order->status == "pending") {
                $order->update([
                    "status" => "delivered",
                    "delivered_by" => $user->id,
                    "delivered_at" => Carbon::now()
                ]);
            } else {
                throw new Exception("Order already delivered");
            }
            return response(["message" => "success", "data" => $order], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * remove order by id
     */
    public function remove(Order $order)
    {
        try {
            $order = Order::find($order->id);
            $order->details_order()->delete();
            $order->delete();
            return true;
        } catch (Exception $err) {
            return false;
        }
    }
    /**
     * print invoice 
     * @param Order $order
     * @param Printer $printer
     * @return Boolean 
     */
    public function printInvoice(Order $order,EscposPrinter $printerCon){
        try {
            $printerCon->selectCharacterTable(16);
            $path = resource_path('js/settings.json');
            $data = null;
            if (File::exists($path)) {
                $content = File::get($path);
                $data = json_decode($content, true);
            } else {
                throw new Exception("file not found");
            }
            $companyName = $data["businessInfo"]["name"];
            $companyAddress = $data["businessInfo"]["adresse"];
            $companyPhone = $data["businessInfo"]["phone"];
            $companyIce = $data["businessInfo"]["ice"];
            $companyEmail = $data["businessInfo"]["email"];
            $currency =  $data["businessInfo"]["currency"]["symbol"];
            $logo = storage_path("app/images/" . $data["businessInfo"]["logo"]);
            //start printing 
            $printerCon->setJustification(EscposPrinter::JUSTIFY_CENTER);
            if (file_exists($logo)) {   // <- check if file exists
                $Logo = EscposImage::load($logo);
                $printerCon->bitImage($Logo);
                $printerCon->feed(1);
            }
            // $printerCon->setJustification(Printer::JUSTIFY_LEFT);
            if ($companyName) {
                $printerCon->setTextSize(1, 1);
                $printerCon->text($companyName);
                $printerCon->feed();
            }
            if ($companyPhone ) {
                $printerCon->setTextSize(1, 1);
                $printerCon->text($companyPhone);
                $printerCon->feed();
            }
            if ($companyAddress) {
                $printerCon->setTextSize(1, 1);
                $printerCon->text($companyAddress);
                $printerCon->feed();
            }
            if ($companyIce) {
                $printerCon->setTextSize(1, 1);
                $printerCon->text("ICE: ".$companyIce);
                $printerCon->feed();
            }
            if ($companyEmail) {
                $printerCon->setTextSize(1, 1);
                $printerCon->text("Email: ".$companyEmail);
                $printerCon->feed();
            }
            $printerCon->text("-------------------------------------------");
            $printerCon->feed();
            $printerCon->setJustification(EscposPrinter::JUSTIFY_LEFT);
            $printerCon->setTextSize(1, 1);
            $printerCon->setEmphasis(true);
            $printerCon->text("Payment");
            $printerCon->feed();
            $printerCon->text('Seller');
            $printerCon->text(" : " . $order->user->name);
            $printerCon->feed();
            $printerCon->text("Order No." . " {$order->id} Le ");
            $printerCon->text( date("d/m/Y H:i:s",strtotime($order->created_at )));
            $printerCon->feed();
            $printerCon->text("Order Type: " . " {$order->type}");
            $printerCon->feed();
            $printerCon->text("Customer: " . " {$order->customer->name} / {$order->customer->sector->title}");
            
            $printerCon->feed();

            $printerCon->setJustification(EscposPrinter::JUSTIFY_LEFT);
            $printerCon->text("-------------------------------------------");
            $printerCon->feed();
            $printerCon->text('Qnt' ."  ".'Name'. "             "."Prix.U". "  ". 'Total'."  "."Discount");
            $printerCon->feed();
            $printerCon->text("-------------------------------------------");
            $printerCon->feed();

            $printerCon->setEmphasis(false);
            foreach ($order->details_order as $item) {
                $printerCon->text( sprintf("%03d", $item->qnt)." ". parent::fixedText($item->product->name,18). "   " . number_format($item->price,2) . "  " . number_format($item->price * $item->qnt , 2). "  ". $item->discount."%");
                $printerCon->feed();
            } 
            $printerCon->text("-------------------------------------------");
            $printerCon->feed();
            $printerCon->text("Nbr.Items: ". $order->numberItems(). "      ");
            $printerCon->setTextSize(1, 1);
            $printerCon->feed();
            $printerCon->text("TOTAL H.Discount: " . number_format($order->totalHTD(),2)." {$currency}");
            $printerCon->feed();
            $printerCon->text("TOTAL Discount: " . number_format($order->totalDiscount(),2)." {$currency}");
            $printerCon->feed();
            $printerCon->text("TOTAL HT: " . number_format($order->totalHT(),2)." {$currency}");
            $printerCon->feed();
            $printerCon->text("TOTAL TAX: " . number_format($order->totalTax(),2)." {$currency}");
            $printerCon->feed();
            $printerCon->text("Montant Fourni: " . number_format($order->amountProvided,2)." {$currency}");
            $printerCon->feed();
            $printerCon->text("Le rest: " . number_format($order->totalTTC() - $order->amountProvided,2)." {$currency}");
            $printerCon->feed();
            $printerCon->setTextSize(2, 2);
            $printerCon->setEmphasis(true);
            $printerCon->text("TOTAL TTC: " . number_format($order->totalTTC(),2)." {$currency}");

            $printerCon->feed(2);
            $printerCon->setTextSize(1, 1);
            $printerCon->setJustification(EscposPrinter::JUSTIFY_CENTER);
            $printerCon->text("---------------------------");
            $printerCon->feed();
            

            $printerCon->cut();
            $printerCon->pulse();
            $printerCon->close();
            
        } catch (Exception $err) {
            throw new Exception("check your network printer");
        }
    }
    /**
     * print invoice using network printer
     * @param Order $order
     * @param Printer $printer
     * @return Boolean 
     */

    public function networkPrintInvoice(Order $order, Printer $printer)
    {
        try {
            
            $connector = new NetworkPrintConnector($printer->ipAdresse, $printer->port);
            $printerCon = new EscposPrinter($connector);
            $this->printInvoice($order, $printerCon);
        } catch (Exception $err) {
            throw new Exception("check your network printer");
        }
    }
    /**
     * local printing
     * @param Order $order
     * @param Printer $printer
     */
    public function localPrintInvoice(Order $order, Printer $printer)
    {
        try {
            $connector = new WindowsPrintConnector($printer->name);
            $printerCon = new EscposPrinter($connector);
            $this->printInvoice($order, $printerCon);
        } catch (Exception $err) {
            throw new Exception("check your local printer");
        }
    }
    /**
     * generate pdf
     * @todo load settings
     * @todo set attribute
     * @todo load items
     */
    public function generateInvoicePdf(Order $order)
    {
        //load settings
        $path = resource_path('js/settings.json');
        $data = null;
        if (File::exists($path)) {
            $content = File::get($path);
            $data = json_decode($content, true);
        } else {
            throw new Exception("file not found");
        }
        $companyName = $data["businessInfo"]["name"];
        $companyAddress = $data["businessInfo"]["adresse"];
        $companyPhone = $data["businessInfo"]["phone"];
        $companyIce = $data["businessInfo"]["ice"];
        $companyEmail = $data["businessInfo"]["email"];
        $currency = $data["businessInfo"]["currency"]["symbol"];
        $logo = storage_path("app/images/" . $data["businessInfo"]["logo"]);

        // Load the Blade template and pass data
        $pdf = Pdf::loadView('pdf.receipt', [
            'companyName' => $companyName,
            'companyAddress' => $companyAddress,
            'companyPhone' => $companyPhone,
            'companyIce' => $companyIce,
            'companyEmail' => $companyEmail,
            'currency' => $currency,
            'logo' => $logo,
            'order' => $order,
            'totalHD' => $order->totalHTD(),
            'totalDiscount' => $order->totalDiscount(),
            'totalHT' => $order->totalHT(),
            'totalTAX' => $order->totalTax(),
            'totalTTC' => $order->totalTTC(),
        ]);
        // $pdf = Pdf::loadView('pdf.receipt', ['order' => $order]);
        return $pdf->output();
    }
    /**
     * export sales 
     * @param Request $request has data sent by front-end
     * data sent by front-end: start dat, end date, user, filter type
     * @return Blob return a blob object ready to download from front-end
     */
    public function export(Request $request){
        try{
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => "",
                "user" => "numeric"
            ]);
            $filterData = $this->filterData($validateFields, "orders.created_at");
            //get sales 
            $sales = [];
            if ($validateFields["user"] != -1) {
                $sales = Order::join(
                    'details_orders',
                    'details_orders.order_id',
                    '=',
                    'orders.id'
                )
                    ->join(
                        'customers',
                        'orders.customer_id',
                        "=",
                        "customers.id"
                    )
                    ->join(
                        'users',
                        'orders.user_id',
                        "=",
                        "users.id"
                    )
                    ->where(
                        'orders.user_id',
                        '=',
                        $validateFields["user"]
                    )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        // DB::raw($filterData["filterType"]),
                        DB::raw('orders.id as id'),
                    DB::raw('DATE_FORMAT(orders.created_at,"%d-%m-%Y %H:%i") as date'),
                        DB::raw('customers.name as customer'),
                        DB::raw('users.name as user'),
                        DB::raw('orders.type as type'),
                        DB::raw('orders.status as status'),
                    DB::raw('orders.tax as tax'),
                        DB::raw('SUM(details_orders.qnt) as qnt'),
                        DB::raw('SUM(details_orders.price * details_orders.qnt * details_orders.discount / 100) as discount'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as total')
                    )
                    ->groupBy("id")
                    ->orderBy('date')
                    ->get();
                $returns = Returns::join(
                    'details_returns',
                    'details_returns.return_id',
                    '=',
                    'returns.id'
                )
                ->join(
                    'orders',
                    'returns.order_id',
                    "=",
                    "orders.id"
                )
                ->join(
                    'users',
                    'orders.user_id',
                    "=",
                    "users.id"
                )
                ->where(
                    'orders.user_id',
                    '=',
                    $validateFields["user"]
                )
                ->whereBetween('orders.created_at', $filterData["filter"])
                ->select(
                    DB::raw('returns.id as id'),
                    DB::raw('orders.id as sale_id'),
                    DB::raw('returns.created_at as created_at'),
                    DB::raw('users.name as user'),
                    DB::raw('SUM(details_returns.qnt) as qnt'),
                    DB::raw('SUM(details_returns.price * details_returns.qnt * details_returns.discount / 100) as discount'),
                    DB::raw('SUM((details_returns.price * details_returns.qnt) - (details_returns.price * details_returns.qnt * details_returns.discount / 100) ) as total')
                )
                ->groupBy("id")
                ->orderBy('created_at')
                ->get();
                
            } else {
                $sales = Order::join(
                    'details_orders',
                    'details_orders.order_id',
                    '=',
                    'orders.id'
                )
                    ->join(
                        'customers',
                        'orders.customer_id',
                        "=",
                        "customers.id"
                    )
                    ->join(
                        'users',
                        'orders.user_id',
                        "=",
                        "users.id"
                    )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                    DB::raw("DATE_FORMAT(orders.created_at,'%d-%m-%Y %H:%i') as date"),
                        DB::raw('orders.id as id'),
                        DB::raw('customers.name as customer'),
                        DB::raw('users.name as user'),
                        DB::raw('orders.type as type'),
                        DB::raw('orders.tax as tax'),
                        DB::raw('orders.status as status'),
                        DB::raw('SUM(details_orders.qnt) as qnt'),
                        DB::raw('SUM(details_orders.price * details_orders.qnt * details_orders.discount / 100) as discount'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as total')
                    )
                    ->groupBy("id")
                    ->orderBy('date')
                    ->get();
                $returns = Returns::join(
                    'details_returns',
                    'details_returns.return_id',
                    '=',
                    'returns.id'
                )
                ->join(
                    'orders',
                    'returns.order_id',
                    "=",
                    "orders.id"
                )
                    ->join(
                        'users',
                        'orders.user_id',
                        "=",
                        "users.id"
                    )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        DB::raw('returns.id as id'),
                        DB::raw('orders.id as sale_id'),
                        DB::raw('returns.created_at as created_at'),
                        DB::raw('users.name as user'),
                        DB::raw('SUM(details_returns.qnt) as qnt'),
                        DB::raw('SUM(details_returns.price * details_returns.qnt * details_returns.discount / 100) as discount'),
                        DB::raw('SUM((details_returns.price * details_returns.qnt) - (details_returns.price * details_returns.qnt * details_returns.discount / 100) ) as total')
                    )
                    ->groupBy("id")
                    ->orderBy('created_at')
                    ->get();
            }
            // merge sales and returns 
            $updatedSales = array_map(function ($item) use ($returns) {
                $item["return_qnt"] = 0;
                foreach ($returns->toArray() as $elem) {
                    if (
                        $item["id"] == $elem["sale_id"]
                    ) {
                        $item["return_qnt"] = $elem["qnt"];
                        break;
                    }
                }
                $item["qnt"] = number_format($item["qnt"], 2, ',', '');
                $item["discount"] = number_format($item["discount"], 2, ',', '');
                $item["total"] = number_format($item["total"], 2, ',', '');
                $item["return_qnt"] = number_format($item["return_qnt"], 2, ',', '');
                return $item;
            }, $sales->toArray());
            // generate CSV
            $fileName = "sales_export_" . date('Y-m-d_H-i-s') . ".csv";
            $headers = [
                "Content-type" => "text/csv; charset=UTF-8",
                "Content-Disposition" => "attachment; filename=$fileName",
                "Pragma" => "no-cache",
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Expires" => "0",
                "Access-Control-Expose-Headers" => "Content-Disposition" 
            ];

            $columns = ['id', 'Date', 'Customer', 'User', 'Type', 'Status', 'Tax', 'Quantity', 'Discount', 'Total', 'Return Qty'];

            $callback = function () use ($updatedSales, $columns) {
                $file = fopen('php://output', 'w');
                fputcsv($file, $columns,";");

                foreach ($updatedSales as $row) {
                    fputcsv($file, [
                        $row['id'],
                        $row['date'],
                        $row['customer'],
                        $row['user'],
                        $row['type'],
                        $row['status'],
                        $row['tax'],
                        $row['qnt'],
                        $row['discount'],
                        $row['total'],
                        $row['return_qnt']
                    ],";");
                }
                fclose($file);
            };

            return ResponseFacades::stream($callback, 200, $headers);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * print sale 
     */
    public function printSale(Request $request){
        try{
            $user = Auth::user();
            $id = $request->route("id");
            $order = Order::find($id);
            if ($user->cashier) {
                //get printer
                if (!empty($user->printer)) {
                    try {
                        if ($user->printer->network) {
                            //network printer
                            $this->networkPrintInvoice($order, $user->printer);
                        } else {
                            //local printer
                            $this->localPrintInvoice($order, $user->printer);
                        }
                    } catch (Exception $err) {
                        $this->remove($order);
                        throw new Exception($err->getMessage());
                    }
                } else {
                    $this->remove($order);
                    throw new Exception("Set up printer");
                }
            } else {
                //it mean this user is seller
                $invoice = $this->generateInvoicePdf($order);
                $pdfBase64 = base64_encode($invoice);
                // return $invoice;
                return response(["message" => "Order Saved with success", "data" => $pdfBase64], Response::HTTP_OK);
            }
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST); 
        }
    }

    /**
     * send invoice to customer the factures
     */
    public function sendSaleToCustomer(Request $request){
        try{
            $id = $request->route("id");
            $order = Order::find($id);
            $path = resource_path('js/settings.json');
            $data = null;
            if (File::exists($path)) {
                $content = File::get($path);
                $data = json_decode($content, true);
            } else {
                throw new Exception("file not found");
            }
            Config::set('mail.mailers.smtp', [
                'transport' => 'smtp',
                'host' => $data["alertSettings"]['host'],  
                'port' => $data["alertSettings"]['port'],
                'encryption' => 'tls',
                'username' => $data["alertSettings"]['username'],
                'password' => $data["alertSettings"]['password'],
                'timeout' => null,
                'auth_mode' => null,
            ]);
            Config::set('mail.from', [
                'address' => $data["alertSettings"]['username'], 
                'name' => $settings['businessInfo']['name'] ?? 'webStock',
            ]);

            $invoice = $this->generateInvoicePdf($order);
            $pdfBase64 = base64_encode($invoice);
            Mail::to( $order->customer->email )->send(new SaleInvoiceMail($order, $invoice));
            return response(["message" => "invoice sent with success"], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST); 
        }
    }
    
}

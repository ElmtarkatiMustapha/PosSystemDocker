<?php

namespace App\Http\Controllers;

use App\Models\Details_return;
use App\Models\Order;
use App\Models\Returns;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

use function PHPSTORM_META\type;

class ReturnController extends Controller
{
    /**
     * get all returns
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
            $filterData = $this->filterData($validateFields, "returns.created_at");
            //get returns
            $returns = [];
            $statistics = [];
            if ($validateFields["user"] != -1) {
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
                    ->whereBetween('returns.created_at', $filterData["filter"])
                    ->select(
                        // DB::raw($filterData["filterType"]),
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
                $statistics = Returns::join(
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
                    ->whereBetween('returns.created_at', $filterData["filter"])
                    ->select(
                        DB::raw('COUNT(DISTINCT returns.id) as returns_count'),
                        DB::raw('SUM((details_returns.price * details_returns.qnt) - (details_returns.price * details_returns.qnt * details_returns.discount / 100) ) as turnover')
                    )
                    ->groupBy("orders.user_id")
                    ->get();
            } else {
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
                    ->whereBetween('returns.created_at', $filterData["filter"])
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
                $statistics = Returns::join(
                    'details_returns',
                    'details_returns.return_id',
                    '=',
                    'returns.id'
                )
                    ->whereBetween('returns.created_at', $filterData["filter"])
                    ->select(
                        DB::raw('COUNT(DISTINCT returns.id) as returns_count'),
                        DB::raw('SUM((details_returns.price * details_returns.qnt) - (details_returns.price * details_returns.qnt * details_returns.discount / 100) ) as turnover')
                    )
                    // ->groupBy("returns.user_id")
                    ->get();
            }
            if (empty($statistics[0]->turnover)) {
                $statistics[0] = collect(["returns_count" => 0, "turnover" => 0]);
            }
            return response(["message" => "success", "data" => collect(["returns" => $returns, "statistics" => $statistics[0]])], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get data of one return
     * @param Request $request (id)
     * @return (details_returns)
     */
    public function getOne(Request $request)
    {
        try {
            $id = $request->route("id");
            $return = Returns::join("details_returns", "returns.id", "=", "details_returns.return_id")
            ->join("products", "products.id", "=", "details_returns.product_id")
            ->where("returns.id", "=", $id)
                ->select(
                    DB::raw("details_returns.id as id"),
                    DB::raw("details_returns.price as price"),
                    DB::raw("details_returns.qnt as return_qnt"),
                    DB::raw("details_returns.discount as discount"),
                    DB::raw("details_returns.margin as margin"),
                    DB::raw("products.barcode as barcode"),
                    DB::raw("products.name as product"),
                    DB::raw("(details_returns.price * details_returns.qnt) - (details_returns.price * details_returns.qnt * details_returns.discount / 100) as total"),
                )
                ->get();
            return response(["message" => "success", "data" => $return], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getOneToEdit(Request $request)
    {
        try {
            $id = $request->route("id");
            $return = Returns::find($id);
            $order = Order::find($return->order_id);
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
                    $order->id
                )
                ->select(
                    DB::raw('details_orders.id as id'),
                    DB::raw('DATE(orders.created_at) as date'),
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
            // return response(["message" => "order empty", "data" => $details_order], Response::HTTP_OK);

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

    public function update(Request $request)
    {
        try {
            $id = $request->route("id");
            $return = Returns::find($id);
            $order = Order::find($return->order_id);
            $orderController = new OrderController();
            return $orderController->updateReturn($request, $order);
        } catch (Exception  $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * remove one
     */
    public function delete(Request  $request)
    {
        try {
            $id = $request->route("id");
            $return  = Returns::find($id);
            $return->details_returns()->delete();
            $return->delete();
            return response(["message" => "delete with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}

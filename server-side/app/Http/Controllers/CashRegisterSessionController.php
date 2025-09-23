<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Returns;
use App\Models\CashRegisterSession;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Response as ResponseFacades;


class CashRegisterSessionController extends Controller
{
    /**
     * create a cash register record
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        try{
            $validateFields = $request->validate(
                [
                    "openingAmount" => "required|numeric",
                    "note" => "string|nullable",
                ]
            );
            $user = Auth::user();
            $cashRegisterSession = CashRegisterSession::create([
                "opened_at"=>Carbon::now(),
                "closed_at"=>null,
                "opening_amount"=>$validateFields['openingAmount'],
                "closing_amount"=>null,
                "note"=>$validateFields['note'],
                "user_id"=>$user->id,
            ]);
            return response(["message" => "session Opened with success", "data" => $cashRegisterSession], Response::HTTP_OK);

        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get all chash register recod
     */
    public function getAll(Request $request){
        try{
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => "",
                "user" => "numeric"
            ]);
            $filterData = $this->filterData($validateFields, "cash_register_sessions.opened_at");

            //get sales
            $sessions = [];
            $statistics = [];
            if ($validateFields["user"] != -1){
                $sessions = CashRegisterSession::join(
                        'users',
                        'cash_register_sessions.user_id',
                        "=",
                        "users.id"
                    )
                    ->where(
                        'cash_register_sessions.user_id',
                        '=',
                        $validateFields["user"]
                    )
                    ->whereBetween('cash_register_sessions.opened_at', $filterData["filter"])
                    ->select(
                        DB::raw('cash_register_sessions.id as id'),
                        DB::raw('DATE_FORMAT(cash_register_sessions.opened_at,"%d-%m-%Y %H:%i") as opened_at'),
                        DB::raw('DATE_FORMAT(cash_register_sessions.closed_at,"%d-%m-%Y %H:%i") as closed_at'),
                        DB::raw('users.name as user'),
                        DB::raw('cash_register_sessions.opening_amount'),
                        DB::raw('cash_register_sessions.closing_amount'),
                        DB::raw('cash_register_sessions.note'),
                    )
                    ->get();
                $statistics = CashRegisterSession::join(
                        'users',
                        'cash_register_sessions.user_id',
                        "=",
                        "users.id"
                    )
                    ->where(
                        'cash_register_sessions.user_id',
                        '=',
                        $validateFields["user"]
                    )
                    ->whereBetween('cash_register_sessions.opened_at', $filterData["filter"])
                    ->select(
                        DB::raw('COUNT(cash_register_sessions.id) as records'),
                        DB::raw('SUM(cash_register_sessions.closing_amount - cash_register_sessions.opening_amount) as total')
                    )
                    ->groupBy("cash_register_sessions.user_id")
                    ->get();
            }else{
                $sessions = CashRegisterSession::join(
                        'users',
                        'cash_register_sessions.user_id',
                        "=",
                        "users.id"
                    )
                    ->whereBetween('cash_register_sessions.opened_at', $filterData["filter"])
                    ->select(
                        DB::raw('cash_register_sessions.id as id'),
                        DB::raw('DATE_FORMAT(cash_register_sessions.opened_at,"%d-%m-%Y %H:%i") as opened_at'),
                        DB::raw('DATE_FORMAT(cash_register_sessions.closed_at,"%d-%m-%Y %H:%i") as closed_at'),
                        DB::raw('users.name as user'),
                        DB::raw('cash_register_sessions.opening_amount'),
                        DB::raw('cash_register_sessions.closing_amount'),
                        DB::raw('cash_register_sessions.note'),
                    )
                    ->get();
                $statistics = CashRegisterSession::join(
                        'users',
                        'cash_register_sessions.user_id',
                        "=",
                        "users.id"
                    )
                    ->whereBetween('cash_register_sessions.opened_at', $filterData["filter"])
                    ->select(
                        DB::raw('COUNT(cash_register_sessions.id) as records'),
                        DB::raw('SUM(cash_register_sessions.closing_amount - cash_register_sessions.opening_amount) as total')
                    )
                    ->get();
            }
            if (empty($statistics[0]->total)) {
                $statistics[0] = collect(["records" => 0, "total" => 0]);
            }
            return response(["message" => "success", "data" => collect(["sessions" => $sessions, "statistics" => $statistics[0]])], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * check if the current user has an opening cach register session 
     */
    public function checkSession(Request $request){
        try{
            $user = Auth::user();
            if ($user->cashier) {
                $cashRegisterSession = $user->cashRegisterSessions()->where("closed_at","=",null)->get();
                if($cashRegisterSession->count() == 0){
                    return response(["message" => "open a session", "data" => 1], Response::HTTP_OK);
                }
                return response(["message" => "Already opened", "data" => $cashRegisterSession], Response::HTTP_OK);
            }
            return response(["message" => "not a cashier", "data" => 0], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * close cash register 
     * @todo get the open session
     * @todo get total of this session (sum total orders)
     * @todo update session info (add close amount, closed_at)
     * @return Response success
     */
    public function closeSession(){
        try{
            $user = Auth::user();

            $cashRegisterSession = $user->cashRegisterSessions()->where("closed_at","=",null)->get();
            if($cashRegisterSession->count() == 0){
                return response(["message" => "already close", "data" => 1], Response::HTTP_BAD_REQUEST);
            }
            $cashRegisterSession[0]->update([
                "closed_at"=>Carbon::now(),
                "closing_amount" => $cashRegisterSession[0]->total() + $cashRegisterSession[0]->opening_amount
            ]);
            return response(["message" => "Already opened", "data" => $cashRegisterSession], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get one by id
     */
    public function getOne(Request $request){
        try{
            $id = $request->route("id");
            $session = CashRegisterSession::find($id);
            return response(["message" => "success", "data" => $session], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * update cash register session 
     */
    public function update(Request $request){
        try{
            $id = $request->route("id");
            $validateFields = $request->validate(
                [
                    "openingAmount" => "required|numeric",
                    "note" => "string|nullable",
                ]
            );
            $session = CashRegisterSession::find($id);
            $session->update([
                "opening_amount"=>$validateFields['openingAmount'],
                "note"=>$validateFields['note']
            ]);
            return response(["message" => "updated", "data" => $session], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * remove cash register session 
     */
    public function delete(Request $request){
        try{
            $id = $request->route("id");
            $session = CashRegisterSession::find($id);
            $session->delete();
            return response(["message" => "session deleted with success"], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get one for single page
     */

    public function getSingle(Request $request){
        try{
            $id = $request->route("id");
            $session = CashRegisterSession::with("user")->find($id);
            $session->total = $session->total();
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
                    ->where('orders.cashRegisterSession_id', "=", $id)
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
                    ->where('orders.cashRegisterSession_id', "=", $id)
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
            return response(["message" => "success", "data" => ["session"=>$session, "orders"=>$updatedSales]], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * export data 
     */
    public function export(Request $request){
        try{
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => "",
                "user" => "numeric"
            ]);
            $filterData = $this->filterData($validateFields, "cash_register_sessions.opened_at");
            //get sales 
            $sales = [];
            $sessions = [];
            if ($validateFields["user"] != -1){
                $sessions = CashRegisterSession::join(
                        'users',
                        'cash_register_sessions.user_id',
                        "=",
                        "users.id"
                    )
                    ->where(
                        'cash_register_sessions.user_id',
                        '=',
                        $validateFields["user"]
                    )
                    ->whereBetween('cash_register_sessions.opened_at', $filterData["filter"])
                    ->select(
                        DB::raw('cash_register_sessions.id as id'),
                        DB::raw('DATE_FORMAT(cash_register_sessions.opened_at,"%d-%m-%Y %H:%i") as opened_at'),
                        DB::raw('DATE_FORMAT(cash_register_sessions.closed_at,"%d-%m-%Y %H:%i") as closed_at'),
                        DB::raw('users.name as user'),
                        DB::raw('cash_register_sessions.opening_amount'),
                        DB::raw('cash_register_sessions.closing_amount'),
                        DB::raw('cash_register_sessions.note'),
                    )
                    ->get();
            }else{
                $sessions = CashRegisterSession::join(
                        'users',
                        'cash_register_sessions.user_id',
                        "=",
                        "users.id"
                    )
                    ->whereBetween('cash_register_sessions.opened_at', $filterData["filter"])
                    ->select(
                        DB::raw('cash_register_sessions.id as id'),
                        DB::raw('DATE_FORMAT(cash_register_sessions.opened_at,"%d-%m-%Y %H:%i") as opened_at'),
                        DB::raw('DATE_FORMAT(cash_register_sessions.closed_at,"%d-%m-%Y %H:%i") as closed_at'),
                        DB::raw('users.name as user'),
                        DB::raw('cash_register_sessions.opening_amount'),
                        DB::raw('cash_register_sessions.closing_amount'),
                        DB::raw('cash_register_sessions.note'),
                    )
                    ->get();
            }
            // generate CSV
            $fileName = "cash_register_sessions_export_" . date('Y-m-d_H-i-s') . ".csv";
            $headers = [
                "Content-type" => "text/csv; charset=UTF-8",
                "Content-Disposition" => "attachment; filename=$fileName",
                "Pragma" => "no-cache",
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Expires" => "0",
                "Access-Control-Expose-Headers" => "Content-Disposition" 
            ];

            $columns = ['id', 'opened_at', 'closed_at', 'User', 'opening_amount', 'closing_amount', 'note'];

            $callback = function () use ($sessions, $columns) {
                $file = fopen('php://output', 'w');
                fputcsv($file, $columns,";");

                foreach ($sessions as $row) {
                    fputcsv($file, [
                        $row['id'],
                        $row['opened_at'],
                        $row['closed_at'],
                        $row['user'],
                        number_format($row['opening_amount'], 2, ',', ''),
                        number_format($row['closing_amount'], 2, ',', ''),
                        $row['note'],
                    ],";");
                }
                fclose($file);
            };

            return ResponseFacades::stream($callback, 200, $headers);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    
}

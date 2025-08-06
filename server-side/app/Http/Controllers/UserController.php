<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

use function PHPUnit\Framework\isEmpty;

class UserController extends Controller
{
    /**
     * get user infos
     * @param Request
     * @return User
     */
    public function getOne(Request $request){
        try{
            //validate data
            $validateFields = $request->validate([
                "user_id" =>"required"
            ]);
            $user = User::with("sectors")->find($validateFields["user_id"]);
            return response(["message"=>"success","user"=>$user],Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @desc get profile infos
     * @todo 
     */
    public function profile(Request $request)
    {
        try {
            //get profile info
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => ""
            ]);
            $userAuth = Auth::user();
            //get user info
            $user = User::with(["roles:title,id", "sectors", "printer"])->find($userAuth->id);
            $allUsers = User::leftJoin("orders", "users.id", "=", "orders.user_id")
            ->leftJoin('details_orders', 'details_orders.order_id', '=', 'orders.id')
            ->select(
                "users.id as id",
                DB::raw("SUM(CASE WHEN orders.payed_margin = 0 and orders.status ='delivered' THEN details_orders.margin END ) as earning"),
            )->groupBy("id")->orderBy("earning", "desc")->get();

            foreach ($allUsers as $key => $value) {
                if ($value->id == $user->id) {
                    $user->earning = $value->earning != null ? $value->earning : 0;
                    $user->rank = $key + 1;
                    break;
                }
            }
            //get roles
            $userRoles = [];
            foreach ($user->roles as $role) {
                array_push($userRoles, $role->title);
            }
            //sales
            if (in_array("admin", $userRoles) || in_array("cachier", $userRoles)) {
                $filterData = $this->filterData($validateFields, "orders.created_at");
                $salesStatistics = User::join('orders', 'users.id', '=', 'orders.user_id')
                ->join(
                    'details_orders',
                    'details_orders.order_id',
                    '=',
                    'orders.id'
                )
                    ->where(
                        'users.id',
                        '=',
                        $user->id
                    )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        DB::raw($filterData["filterType"]),
                        DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                    )
                    ->groupBy("date")
                    ->orderBy('date')
                    ->get();

                $sales = User::join('orders', 'users.id', '=', 'orders.user_id')
                ->join('details_orders', 'details_orders.order_id', '=', 'orders.id')
                ->join("customers", "orders.customer_id", "=", "customers.id")
                ->where(
                    'users.id',
                    '=',
                    $user->id
                )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        "users.name as user",
                        "customers.name as customer",
                        "orders.status as status",
                        DB::raw($filterData["filterType"]),
                        DB::raw('orders.id as id'),
                        DB::raw('SUM(details_orders.qnt) as qnt'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                    )
                    ->groupBy("id")
                    ->orderBy('date')
                    ->get();
                $user->salesStatistics = parent::prepareSales($salesStatistics, $filterData["days"], $filterData["prefix"]);
                $user->sales = $sales;
                $user->filterTitle = $filterData["filterTitle"];
            }
            //delivred order
            if (in_array("admin", $userRoles) || in_array("delivery", $userRoles)) {
                $filterData = $this->filterData($validateFields, "orders.delivered_at");
                $deliveredOrdersStatistics = User::join('orders', 'users.id', '=', 'orders.delivered_by')
                ->join(
                    'details_orders',
                    'details_orders.order_id',
                    '=',
                    'orders.id'
                )
                    ->where('users.id', '=', $user->id)
                    ->where('orders.status', '=', "delivered")
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        DB::raw($filterData["filterType"]),
                        DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                    )
                    ->groupBy("date")
                    ->orderBy('date')
                    ->get();

                $deliveredOrders = User::join('orders', 'users.id', '=', 'orders.delivered_by')
                ->join('details_orders', 'details_orders.order_id', '=', 'orders.id')
                ->join("customers", "orders.customer_id", "=", "customers.id")
                ->where('users.id', '=', $user->id)
                    ->where('orders.status', '=', "delivered")
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        "users.name as user",
                        "customers.name as customer",
                        "orders.status as status",
                        DB::raw($filterData["filterType"]),
                        DB::raw('orders.id as id'),
                    DB::raw('DATE(orders.delivered_at) as delivered_at'),
                        DB::raw('SUM(details_orders.qnt) as qnt'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                    )
                    ->groupBy("id")
                    ->orderBy('date')
                    ->get();
                $user->deliveredOrderStatistics = parent::prepareSales($deliveredOrdersStatistics, $filterData["days"], $filterData["prefix"]);
                $user->deliveredOrder = $deliveredOrders;
                $user->filterTitle = $filterData["filterTitle"];
            }
            return response(["message" => "success", "user" => $user], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @desc update Profile 
     * @param Request 
     */
    public function updateProfile(Request $request)
    {
        try {
            $id = $request->route("id");
            $validateFields = $request->validate([
                "name" => "required",
                "cin" => "required",
                "phone" => "string|nullable",
                "picture" => "image|nullable"
            ]);
            $user  = User::find($id);
            //delete old picture if picture field is filled and upload the new one
            $pictureName = $user->picture;
            if (isset($validateFields["picture"]) && !empty($validateFields["picture"])) {
                $pictureName = parent::update_picture($validateFields["picture"], $user);
            }
            //update user data
            $dataToUpdate = [
                "name" => $validateFields["name"],
                "cin" => $validateFields["cin"],
                "phone" => $validateFields["phone"],
                "picture" => $pictureName,
            ];
            $user->update($dataToUpdate);
            $user->roles;
            $user->sectors;
            return response(["message" => "success", "data" => $user], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @desc return data to the single page 
     * @param Request
     * @todo catch user id, filter type, date start and date end 
     * @todo get user infos
     * @todo get user sales filtered by filterType if has a cachier or admin role
     * @todo get user purchases filtered by filterType if has a admin role
     * @todo get user delivered order filtered by filterType if has a delivery or admin role
     * @todo get user return filtered by filterType if has a manager or admin role
     * @todo get user expense filtered by filterType if has a manager or admin role
     * 
     * @return Response user data
     */
    public function getSingle(Request $request)
    {
        try {
            // catch request param
            $id = $request->route("id");
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => ""
            ]);
            //get user info
            $user = User::with(["roles:title,id", "sectors", "printer"])->find($id);
            $allUsers = User::leftJoin("orders", "users.id", "=", "orders.user_id")
            ->leftJoin('details_orders', 'details_orders.order_id', '=', 'orders.id')
            ->select(
                "users.id as id",
                DB::raw("SUM(CASE WHEN orders.payed_margin = 0 and orders.status ='delivered' THEN details_orders.margin END ) as earning"),
            )->groupBy("id")->orderBy("earning", "desc")->get();

            foreach ($allUsers as $key => $value) {
                if ($value->id == $id) {
                    $user->earning = $value->earning != null ? $value->earning : 0;
                    $user->rank = $key + 1;
                    break;
                }
            }
            //get roles
            $userRoles = [];
            foreach ($user->roles as $role) {
                array_push($userRoles, $role->title);
            }
            //get sales
            if (in_array("admin", $userRoles) || in_array("cachier", $userRoles)) {
                $filterData = $this->filterData($validateFields, "orders.created_at");
                $salesStatistics = User::join('orders', 'users.id', '=', 'orders.user_id')
                ->join(
                    'details_orders',
                    'details_orders.order_id',
                    '=',
                    'orders.id'
                )
                    ->where(
                        'users.id',
                        '=',
                        $id
                    )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        DB::raw($filterData["filterType"]),
                        DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                    )
                    ->groupBy("date")
                    ->orderBy('date')
                    ->get();

                $sales = User::join('orders', 'users.id', '=', 'orders.user_id')
                ->join('details_orders', 'details_orders.order_id', '=', 'orders.id')
                ->join("customers", "orders.customer_id", "=", "customers.id")
                ->where(
                    'users.id',
                    '=',
                    $id
                )
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        "users.name as user",
                        "customers.name as customer",
                        "orders.status as status",
                        DB::raw($filterData["filterType"]),
                        DB::raw('orders.id as id'),
                        DB::raw('SUM(details_orders.qnt) as qnt'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                    )
                    ->groupBy("id")
                    ->orderBy('date')
                    ->get();
                $user->salesStatistics = parent::prepareSales($salesStatistics, $filterData["days"], $filterData["prefix"]);
                $user->sales = $sales;
                $user->filterTitle = $filterData["filterTitle"];
            }
            // get purchase
            if (in_array("admin", $userRoles)) {
                $filterData = $this->filterData($validateFields, "purchases.created_at");
                $purchasesStatistics = User::join("purchases", "users.id", "=", "purchases.user_id")
                ->join("stocks", "purchases.id", "=", "stocks.purchase_id")
                ->where("users.id", "=", $id)
                    ->whereBetween('purchases.created_at', $filterData["filter"])
                    ->select(
                        DB::raw($filterData["filterType"]),
                        DB::raw('COUNT(DISTINCT purchases.id) as order_count'),
                    )
                    ->groupBy("date")
                    ->orderBy('date')
                    ->get();
                $purchases = User::join("purchases", "users.id", "=", "purchases.user_id")
                ->join("stocks", "purchases.id", "=", "stocks.purchase_id")
                ->join("suppliers", "purchases.supplier_id", "=", "suppliers.id")
                ->where("users.id", "=", $id)
                    ->whereBetween('purchases.created_at', $filterData["filter"])
                    ->select(
                        "users.name as user",
                        DB::raw($filterData["filterType"]),
                        DB::raw('purchases.id as id'),
                        DB::raw('SUM(stocks.stock_init) as qnt'),
                        DB::raw('SUM((stocks.price * stocks.stock_init)) as total')
                    )
                    ->groupBy("id")
                    ->orderBy('date')
                    ->get();
                $user->purchasesStatistics = parent::prepareSales($purchasesStatistics, $filterData["days"], $filterData["prefix"]);
                $user->purchases = $purchases;
                $user->filterTitle = $filterData["filterTitle"];
            }

            //delivred orders
            if (in_array("admin", $userRoles) || in_array("delivery", $userRoles)) {
                $filterData = $this->filterData($validateFields, "orders.delivered_at");
                $deliveredOrdersStatistics = User::join('orders', 'users.id', '=', 'orders.delivered_by')
                ->join(
                    'details_orders',
                    'details_orders.order_id',
                    '=',
                    'orders.id'
                )
                    ->where('users.id', '=', $id)
                    ->where('orders.status', '=', "delivered")
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        DB::raw($filterData["filterType"]),
                        DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                    )
                    ->groupBy("date")
                    ->orderBy('date')
                    ->get();

                $deliveredOrders = User::join('orders', 'users.id', '=', 'orders.delivered_by')
                ->join('details_orders', 'details_orders.order_id', '=', 'orders.id')
                ->join("customers", "orders.customer_id", "=", "customers.id")
                ->where('users.id', '=', $id)
                    ->where('orders.status', '=', "delivered")
                    ->whereBetween('orders.created_at', $filterData["filter"])
                    ->select(
                        "users.name as user",
                        "customers.name as customer",
                        "orders.status as status",
                        DB::raw($filterData["filterType"]),
                        DB::raw('orders.id as id'),
                    DB::raw('DATE(orders.delivered_at) as delivered_at'),
                        DB::raw('SUM(details_orders.qnt) as qnt'),
                        DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                    )
                    ->groupBy("id")
                    ->orderBy('date')
                    ->get();
                $user->deliveredOrderStatistics = parent::prepareSales($deliveredOrdersStatistics, $filterData["days"], $filterData["prefix"]);
                $user->deliveredOrder = $deliveredOrders;
                $user->filterTitle = $filterData["filterTitle"];
            }

            //get returns
            if (in_array("admin", $userRoles) || in_array("manager", $userRoles)) {
                $filterData = $this->filterData($validateFields, "returns.created_at");
                $returnsStatistics = User::join('returns', 'users.id', '=', 'returns.user_id')
                ->join(
                    'details_returns',
                    'details_returns.return_id',
                    '=',
                    'returns.id'
                )
                    ->where(
                        'users.id',
                        '=',
                        $id
                    )
                    ->whereBetween('returns.created_at', $filterData["filter"])
                    ->select(
                        DB::raw($filterData["filterType"]),
                        DB::raw('COUNT(DISTINCT returns.id) as order_count'),
                        DB::raw('SUM((details_returns.price * details_returns.qnt)) as total')
                    )
                    ->groupBy("date")
                    ->orderBy('date')
                    ->get();

                $returns = User::join('returns', 'users.id', '=', 'returns.user_id')
                ->join('details_returns', 'details_returns.return_id', '=', 'returns.id')
                ->where(
                    'users.id',
                    '=',
                    $id
                )
                    ->whereBetween('returns.created_at', $filterData["filter"])
                    ->select(
                        "users.name as user",
                        "returns.order_id as order",
                        DB::raw($filterData["filterType"]),
                        DB::raw('returns.id as id'),
                        DB::raw('SUM(details_returns.qnt) as qnt'),
                        DB::raw('SUM((details_returns.price * details_returns.qnt)) as turnover')
                    )
                    ->groupBy("id")
                    ->orderBy('date')
                    ->get();
                $user->returnsStatistics = parent::prepareSales($returnsStatistics, $filterData["days"], $filterData["prefix"]);
                $user->returns = $returns;
                $user->filterTitle = $filterData["filterTitle"];
            }
            //get expenses
            if (in_array("admin", $userRoles)) {
                $filterData = $this->filterData($validateFields, "expenses.created_at");
                $costsStatistics = User::join("expenses", "users.id", "=", "expenses.user_id")
                ->where('users.id', '=', $id)
                    ->whereBetween('expenses.created_at', $filterData["filter"])
                    ->select(
                        DB::raw($filterData["filterType"]),
                        DB::raw('COUNT(expenses.id) as order_count'),
                        DB::raw('SUM(expenses.amount) as total')
                    )
                    ->groupBy('date')
                    ->orderBy('date')
                    ->get();
                $costs = User::join("expenses", "users.id", "=", "expenses.user_id")
                ->where('users.id', '=', $id)
                    ->whereBetween('expenses.created_at', $filterData["filter"])
                    ->select(
                        "expenses.id as id",
                        "expenses.title as title",
                        DB::raw($filterData["filterType"]),
                        DB::raw('SUM(expenses.amount) as total')
                    )
                    ->groupBy('id')
                    ->orderBy('date')
                    ->get();
                $user->costsStatistics = parent::prepareSales($costsStatistics, $filterData["days"], $filterData["prefix"]);
                $user->costs = $costs;
                $user->filterTitle = $filterData["filterTitle"];
            }
            return response(["message" => "success", "data" => $user], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * pay the earning 
     * @param Request
     * @return response
     */
    public function payEarning(Request $request)
    {
        try {
            $id = $request->route("id");
            Order::where("status", "=", "delivered")
            ->where("user_id", "=", $id)
                ->update(["payed_margin" => 1]);
            return response(["message" => "success"], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * create user
     * @param Request
     * @return response
     */
    public function create(Request $request){
        //this function used to add user
        try{
            //validate fields
            $validateFields = $request->validate([
                "name" => "required",
                "email" => "required|email",
                "username" => "required",
                "cin" => "required",
                "phone" => "string|nullable",
                "password" => "required",
                "sectors" => "required|array",
                "roles" => "required|array",
                "printer_id" => "nullable",
                "picture" => "image|nullable",
                "cashier" => "required"
            ]);
            //handle user error
            if (count(User::where("username", "=", $validateFields["username"])->get()) > 0) {
                throw new Exception("Username already exist");
            }
            if (count(User::where(
                "email",
                "=",
                $validateFields["email"]
            )->get()) > 0) {
                throw new Exception("Email already exist");
            }
            //upload picture
            $pictureName="";
            if(isset($validateFields["picture"]) && !empty($validateFields["picture"])){
                $pictureName = parent::upload_picture($validateFields["picture"]);
            }

            //create user
            $user = User::create([
                'name'=>$validateFields["name"],
                'cin'=>$validateFields["cin"],
                'phone'=>$validateFields["phone"],
                "username"=>$validateFields["username"],
                'picture'=> $pictureName,
                'email'=>$validateFields["email"],
                'printer_id' => $validateFields["printer_id"],
                'cashier' => $validateFields["cashier"],
                'password'=>Hash::make($validateFields["password"])
            ]);

            // //assign sector
            if(isset($validateFields["sectors"]) && $validateFields["sectors"][0] != null){
                $user->sectors()->attach($validateFields["sectors"]);
            }
            // //assign roles
            $user->roles()->attach($validateFields["roles"]);
            $user->earning = 0;
            $user->orders = 0;
            $user->active = 1;
            $user->roles;
            $user->sectors;
            return response(["message" => "success", "data" => $user], Response::HTTP_OK);
            // return response(["message" => "success", "data" => $validateFields["picture"]->extension()], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
        
    }

    public function sync_sectors(Request $request){
        try{
            $validateFields = $request->validate([
                "userId" => "required",
                "sectors" => "array"
            ]);
            if(!isset($validateFields["sectors"]) || $validateFields["sectors"][0]==null){
                $validateFields["sectors"] = [];
            }
            $user = User::find($validateFields["userId"]);
            $user->sectors()->sync($validateFields["sectors"]);
            return response(["message" => "success"], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @param Request $request
     * @todo validate fields
     * @todo update the picture
     * @todo update password if seted
     * @todo update user info
     * @todo sync the roles and sectors
     * @return new {User} infos
     */
    public function update(Request $request){
        try{
            $id = $request->route("id");
            $validateFields = $request->validate([
                "name" => "required",
                "email" => "required|email",
                "username" => "required",
                "cin" => "required",
                "phone" => "string|nullable",
                "password" => "string|nullable",
                "sectors" => "required|array",
                "roles" => "required|array",
                "picture" => "image|nullable",
                "printer_id" => "nullable",
                "active" => "required",
                "cashier" => "required"
            ]);
            $user  = User::find($id);
            $currentUser = Auth::user();
            //delete old picture if picture field is filled and upload the new one
            $pictureName = $user->picture;
            if(isset($validateFields["picture"]) && !empty($validateFields["picture"])){
                $pictureName = parent::update_picture($validateFields["picture"], $user);
            }
            //check if the password seted
            if (isset($validateFields["password"]) && !empty($validateFields["password"])) {
                $user->update([
                    'password' => Hash::make($validateFields["password"])
                ]);
            }
            //update user data
            $dataToUpdate = [
                "name" => $validateFields["name"],
                "email" => $validateFields["email"],
                "username" => $validateFields["username"],
                "cin" => $validateFields["cin"],
                "phone" => $validateFields["phone"],
                "printer_id" => $validateFields["printer_id"],
                "picture" => $pictureName,
                "cashier" => $validateFields["cashier"],
            ];
            if ($currentUser->id != $user->id) {
                $dataToUpdate["active"] = $validateFields["active"];
                //sync roles
                $user->roles()->sync($validateFields["roles"]);
            }
            $user->update($dataToUpdate);
            $user->sectors()->sync($validateFields["sectors"]);
            $user->roles;
            $user->sectors;
            $user->printer;

            return response(["message" => "success", "data" => $user], Response::HTTP_OK); 
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * reset password for a user
     * @param Request
     * @return response
     */
    public function reset_pass(Request $request){
        try{
            //validate field 
            $validateFields = $request->validate([
                "user_id" => "required",
                "password" => "required"
            ]);
            //update password
            User::where("id",$validateFields["user_id"])
            ->update(["password",Hash::make($validateFields["password"])]);
            //update return response
            return response(["message"=>"success"],Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get all users
     * @param Request $request
     * @return Response $response
     * [user infos, Array roles, earning, sales]
     */
    public function getAll(Request $request)
    {
        try {
            $users = User::leftJoin("orders", "users.id", "=", "orders.user_id")
            ->leftJoin('details_orders', 'details_orders.order_id', '=', 'orders.id')
            ->with("roles:title,id")
            ->select(
                "users.id as id",
                "users.name as name",
                "users.phone as phone",
                "users.username as username",
                "users.picture as picture",
                "users.email as email",
                "users.active as active",
                "users.cashier as cashier",
                "users.cin as cin",
                DB::raw("SUM(CASE WHEN orders.payed_margin = 0 and orders.status ='delivered' THEN details_orders.margin END ) as earning"),
                DB::raw("COUNT(orders.id ) as orders"),
            )->groupBy("id")->get();
            return response(["message" => "success", "data" => $users], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @return response containe user infos for edit modale
     */
    public function getOneManage(Request $request)
    {
        try {
            $id = $request->route("id");
            $user = User::with(["roles:title,id", "sectors"])->find($id);
            return response(["message" => "success", "data" => $user], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @description delete function 
     * @param $request
     * @todo check if the user is the same connected one
     * @todo detach roles
     * @todo detach sectors
     * @todo delete picture if exist
     * @todo delete user
     * @return response success of delete
     */
    public function delete(Request $request)
    {
        try {
            $id = $request->route("id");
            $currentUser = Auth::user();
            $user = User::find($id);
            if ($currentUser->id == $user->id) {
                throw new Exception("you can't delete the connected user");
            }
            $user->roles()->detach();
            $user->sectors()->detach();
            $this->delete_picture($user);
            $user->delete();
            return response(["message" => "success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * check if admin
     */
    public function isAdmin($userId)
    {
        $user = User::find($userId);
        $roles = [];
        foreach ($user->roles as $role) {
            array_push($roles, $role->title);
        }
        if (!empty($user) && in_array("admin", $roles)) {
            return true;
        }
        return false;
    }

}

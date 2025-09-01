<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Sector;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class CustomerController extends Controller
{
    /**
     * create customer
     * @param Request
     * @return response
     */
    public function create(Request $request){
        try{
            //validate fields 
            $validateFields = $request->validate([
                "name"=>"required|string",
                "adresse"=>"required|string",
                "ice" => "string|nullable",
                "phone" => "string|nullable",
                "email" => "string|nullable",
                "sector_id"=>"required",
                "picture" => "image|nullable"
            ]);
            //upload picture
            if(isset($validateFields["picture"]) && !empty($validateFields["picture"])){
                $validateFields["picture"] = parent::upload_picture($validateFields["picture"]);
            }
            //create customer
            $customer = Customer::create($validateFields);
            $customer->total = 0;
            $customer->orders = 0;
            $customer->active = 1;

            return response(["message" => "success", "data" => $this->dataStructure($customer)], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * update customer
     * @param Request
     * @return response
     */
    public function update(Request $request){
        try{
            //validate field
            $validateFields = $request->validate([
                "name" => "required|string",
                "adresse" => "required|string",
                "ice" => "string|nullable",
                "phone" => "string|nullable",
                "email" => "string|nullable",
                "active" => "boolean",
                "sector_id" => "required",
                "picture" => "image|nullable"
            ]);
            $id = $request->route("id");
            //get the customer
            $customer = Customer::find($id);
            //update picture
            if(isset($validateFields["picture"]) && !empty($validateFields["picture"])){
                $validateFields["picture"]=parent::update_picture($validateFields["picture"],$customer);
            }
            //update customer
            $customer->update($validateFields);
            $result = 0;
            for ($j = 0; $j < count($customer->orders); $j++) {
                $result += $customer->orders[$j]->totalOrder();
            }
            $customer->total = $result;
            $customer->orders = count($customer->orders);
            return response(["message" => "success", "data" => $this->dataStructure($customer)], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * update customer from cashier
     * @param Request
     * @return response
     */
    public function updateCashier(Request $request)
    {
        try {

            //validate field
            $validateFields = $request->validate([
                "name" => "required|string",
                "adresse" => "required|string",
                "ice" => "string|nullable",
                "email" => "string|nullable",
                "phone" => "string|nullable",
                "sector_id" => "required",
                "picture" => "image|nullable"
            ]);
            $id = $request->route("id");
            $userAuth = Auth::user();
            $user = User::find($userAuth->id);
            //get the customer
            $customer = Customer::find($id);
            //get all user sectors to check if the customer includes
            $userSectorsIDs = [];
            foreach ($user->sectors as $sector) {
                array_push($userSectorsIDs, $sector->id);
            }
            //check if include
            if (!in_array($customer->sector_id, $userSectorsIDs)) {
                throw new Exception("No customer matches");
            }
            //update picture
            if (isset($validateFields["picture"]) && !empty($validateFields["picture"])) {
                $validateFields["picture"] = parent::update_picture($validateFields["picture"], $customer);
            }
            //update customer
            $customer->update($validateFields);
            $result = 0;
            for ($j = 0; $j < count($customer->orders); $j++) {
                $result += $customer->orders[$j]->totalOrder();
            }
            $customer->total = $result;
            $customer->orders = count($customer->orders);
            return response(["message" => "success", "data" => $this->dataStructure($customer)], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * delete one
     * @param request
     * @return response
     */
    public function delete(Request $request)
    {
        try {
            $id = $request->route("id");
            $customer = Customer::find($id);
            $this->delete_picture($customer);
            $customer->delete();
            return response(["message" => "success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get all customers
     * @param request
     * @return response
     */
    public function userCustomers()
    {
        try{
            $userAuth = Auth::user();
            $user = User::find($userAuth->id);
            $customers = $user->customers();
            $data = [];
            for ($i = 0; $i < count($customers); $i++) {
                $sector = Sector::find($customers[$i]["sector_id"]);
                $data[] = collect([
                    "id" => $customers[$i]["id"],
                    "name" => $customers[$i]["name"],
                    "adresse" => $customers[$i]["adresse"],
                    "ice" => $customers[$i]["ice"],
                    "email" => $customers[$i]["email"],
                    "phone" => $customers[$i]["phone"],
                    "active" => $customers[$i]["active"],
                    "sector" => $sector->id,
                    "sectorTitle" => $sector->title,
                    "picture" => $customers[$i]["picture"]
                ]);
            }
            // $customers = Customer::whereIn("sector_id", )->get();
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get all customers
     */
    public function getAll()
    {
        try {
            $customers = Customer::get();
            $data = [];
            for ($i = 0; $i < count($customers); $i++) {
                $result = 0;
                for ($j = 0; $j < count($customers[$i]->orders); $j++) {
                    $result += $customers[$i]->orders[$j]->totalOrder();
                }
                $data[] = collect([
                    "id" => $customers[$i]->id,
                    "name" => $customers[$i]->name,
                    "adresse" => $customers[$i]->adresse,
                    "ice" => $customers[$i]->ice,
                    "email" => $customers[$i]->email,
                    "phone" => $customers[$i]->phone,
                    "active" => $customers[$i]->active,
                    "sector" => $customers[$i]->sector,
                    "picture" => $customers[$i]->picture,
                    "total" => $result,
                    "purchase" => count($customers[$i]->orders),
                ]);
            }
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    //get one for edit
    public function getOne(Request $request)
    {
        try {
            $id = $request->route("id");
            $customer = Customer::find($id);
            if (empty($customer)) {
                throw new Exception("no customer matches");
            }
            $sectors = Sector::all();
            return response(["message" => "success", "data" => $customer, "sectors" => $sectors], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    //get one for edit in cashier page
    public function getOneCashier(Request $request)
    {
        try {
            $id = $request->route("id");
            $userAuth = Auth::user();
            $user = User::find($userAuth->id);
            $customer = Customer::find($id);
            //check if empty
            if (empty($customer)) {
                throw new Exception("no customer matches");
            }
            //get all user sectors to check if the customer includes
            $userSectorsIDs = [];
            foreach ($user->sectors as $sector) {
                array_push($userSectorsIDs, $sector->id);
            }
            //check if include
            if (!in_array($customer->sector_id, $userSectorsIDs)) {
                throw new Exception("no customer matches");
            }
            $sectors = $user->sectors;
            return response(["message" => "success", "data" => $customer, "sectors" => $sectors], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    //get single one 
    public function getOneSingle(Request $request)
    {
        try {
            $id = $request->route("id");
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => ""
            ]);
            $customer = Customer::with("sector")->find($id);
            $filterData = $this->filterData($validateFields, "orders.created_at");
            $sales = Customer::join('orders', 'customers.id', '=', 'orders.customer_id')
            ->join('details_orders', 'details_orders.order_id', '=', 'orders.id')
            ->where(
                'customers.id',
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
            $orders = Customer::join('orders', 'customers.id', '=', 'orders.customer_id')
            ->join('details_orders', 'details_orders.order_id', '=', 'orders.id')
            ->join("users", "orders.user_id", "=", "users.id")
            ->where(
                'customers.id',
                '=',
                $id
            )
                ->whereBetween('orders.created_at', $filterData["filter"])
                ->select(
                    "users.name as user",
                DB::raw($filterData["filterType"]),
                    DB::raw('orders.id as id'),
                    DB::raw('SUM(details_orders.qnt) as qnt'),
                    DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                )
                ->groupBy("id")
                ->orderBy('date')
                ->get();

            $customer->filterTitle = $filterData["filterTitle"];
            $customer->turnover = parent::prepareTurnover($sales, $filterData["days"], $filterData["prefix"]);
            $customer->orders = $orders;
            return response(["message" => "success", "data" => $customer], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    //organise data to return 
    public function dataStructure($customer)
    {
        return
            collect([
                "id" => $customer->id,
                "name" => $customer->name,
                "adresse" => $customer->adresse,
                "ice" => $customer->ice,
                "email" => $customer->email,
                "phone" => $customer->phone,
                "active" => $customer->active,
                "sector" => $customer->sector,
                "sectorTitle" => $customer->sector->title,
                "picture" => $customer->picture,
                "total" => $customer->total,
                "purchase" => $customer->orders,
            ]);
    }
}

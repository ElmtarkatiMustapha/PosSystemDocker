<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Sector;
use App\Models\Sector_user;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

use function PHPSTORM_META\map;

class SectorController extends Controller
{
    public function create(Request $request){
        try{
            $validateFields = $request->validate([
                "title" => "required",
                "adresse" => "string|nullable"
            ]);
            $sector = Sector::create([
                "title" => $validateFields["title"],
                "adresse" => $validateFields["adresse"]
            ]);
            $sector->nbSales = 0;
            $sector->nbUsers = 0;
            $sector->active = true;
            return response(["message" => "success", "data" => $sector], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function update(Request $request){
        try{
            $id = $request->route("id");
            $validateFields = $request->validate([
                "title"=>"required",
                "adresse" => "string|nullable",
                "active" => "boolean",
            ]);
            $sector = Sector::find($id);
            $sector->update([
                "title"=>$validateFields["title"],
                "adresse" => $validateFields["adresse"],
                "active" => $validateFields["active"],
            ]);
            $data = collect([
                "id" => $sector->id,
                "title" => $sector->title,
                "adresse" => $sector->adresse,
                "active" => $sector->active,
                "nbSales" => count($sector->orders()),
                "nbUsers" => count($sector->users),
            ]);
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message"=>$err->getMessage()], Response::HTTP_BAD_REQUEST);
        }

    }

    /**
     *  Remove the specified sector
     * @param Request
     * @return Response
     */
    public function delete(Request $request)
    {
        try{
            $id = $request->route("id");
            $sector = Sector::find($id);
            //detach users 
            $sector->users()->detach();
            //detach all customers
            foreach($sector->customers as $customer){
                $customer->sector()->dissociate();
                $customer->save();
            }
            //delete 
            $sector->delete();
            return response(["message"=> "success"], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    //getAll sectors from here
    public function getUserSectors(Request $request)
    {
        try{
            $userAuth = Auth::user();
            $user = User::find($userAuth->id);
            return response(["message" => "success","data"=>$user->sectors], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function detachOne(Request $request)
    {
        try {
            $id = $request->route("id");
            $validateFields = $request->validate([
                "idUser" => "required"
            ]);
            $sector = Sector::find($id);
            $sector->users()->detach($validateFields("idUser"));
            return response(["message" => "success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getAll(Request $request)
    {
        try {
            $data = [];
            $sectors = Sector::with("users")->get();
            for ($i = 0; $i < count($sectors); $i++) {
                $data[] = collect([
                    "id" => $sectors[$i]->id,
                    "title" => $sectors[$i]->title,
                    "adresse" => $sectors[$i]->adresse,
                    "active" => $sectors[$i]->active,
                    "nbSales" => count($sectors[$i]->orders()),
                    "nbUsers" => count($sectors[$i]->users),
                ]);
            }
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get one item
     */
    public function getOne(Request $request)
    {
        try {
            $id = $request->route("id");
            $sector = Sector::find($id);
            return response(["message" => "success", "data" => $sector], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getOneSingle(Request $request)
    {
        try {
            $id = $request->route("id");
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => ""
            ]);
            $sector = Sector::find($id);
            $filter = [];
            $days = [];
            $prefix = "";
            $filterTitle = "Current Week";
            switch ($validateFields['filter']) {
                case "today":
                    $filter = [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()];
                    $filterType = "HOUR(orders.created_at) as date";
                    $days = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
                    $prefix = "hour";
                    $filterTitle = "Today";
                    break;
                case "yesterday":
                    $filter = [Carbon::yesterday()->startOfDay(), Carbon::yesterday()->endOfDay()];
                    $filterType = "HOUR(orders.created_at) as date";
                    $days = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
                    $prefix = "hour";
                    $filterTitle = "Yesterday";
                    break;
                case "month":
                    //code
                    $filter = [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()];
                    $filterType = "DATE(orders.created_at) as date";
                    $days = $this->daysOfMonth();
                    $prefix = "day";
                    $filterTitle = "Current Month";
                    break;
                case "year":
                    //code
                    $filter = [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()];
                    $filterType = "MONTH(orders.created_at) as date";
                    $days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                    $prefix = "month";
                    $filterTitle = "Current Year";
                    break;
                case "range":
                    //get date 
                    $timeStart = strtotime($validateFields["startDate"]);
                    $timeEnd = strtotime($validateFields["endDate"]);
                    $filter = [date("Y-m-d", $timeStart), date("Y-m-d", $timeEnd + 86400)];
                    $filterType = "DATE(orders.created_at) as date";
                    $days = $this->daysOfRange($validateFields["startDate"], $validateFields["endDate"]);
                    $prefix = "day";
                    $filterTitle = "from " . date("Y-m-d", $timeStart) . "to" . date("Y-m-d", $timeEnd);
                    break;
                default:
                    $filter = [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()];
                    $filterType = "DATE(orders.created_at) as date";
                    $days = $this->daysOfWeek();
                    $prefix = "day";
                    $filterTitle = "Current Week";
            }
            $sales = Sector::join('customers', 'customers.sector_id', '=', 'sectors.id')
            ->join('orders', 'customers.id', '=', 'orders.customer_id')
            ->join('details_orders', 'details_orders.order_id', '=', 'orders.id')
            ->where(
                'sectors.id',
                '=',
                $id
            )
                ->whereBetween('orders.created_at', $filter)
                ->select(
                    DB::raw($filterType),
                    DB::raw('COUNT(DISTINCT orders.id) as order_count'),
                    DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                )
                ->groupBy("date")
                ->orderBy('date')
                ->get();
            $dataUsers = User::join('sector_user', 'users.id', '=', 'sector_user.user_id')
            ->join("sectors", "sectors.id", "=", "sector_user.sector_id")
            ->join('customers', 'customers.sector_id', '=', 'sectors.id')
            ->join('orders', 'customers.id', '=', 'orders.customer_id')
            ->join('details_orders', 'details_orders.order_id', '=', 'orders.id')
            ->where(
                'sectors.id',
                '=',
                $id
            )
                ->whereBetween('orders.created_at', $filter)
                ->select(
                    DB::raw("users.id as id"),
                    DB::raw("users.name as name"),
                    DB::raw('COUNT(DISTINCT orders.id) as nbSales'),
                    DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover')
                )
                ->groupBy("id")
                ->groupBy("name")
                ->orderBy('id')
                ->get();
            $sector->usersData = array_map(function ($user) use ($dataUsers) {
                $data = collect([
                    "id" => $user->id,
                    "name" => $user->name,
                    "turnover" => 0,
                    "nbSales" => 0
                ]);
                foreach ($dataUsers as $item) {
                    if ($user->id == $item->id) {
                        $data["turnover"] = $item->turnover;
                        $data["nbSales"] = $item->nbSales;
                    }
                }
                return $data;
            }, array(...$sector->users));
            $sector->filterTitle = $filterTitle;
            $sector->sales = parent::prepareSales($sales, $days, $prefix);
            $sector->turnover = parent::prepareTurnover($sales, $days, $prefix);
            return response(["message" => "success", "data" => $sector], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}

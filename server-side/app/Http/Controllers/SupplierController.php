<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class SupplierController extends Controller
{
    /**
     * create supplier
     */
    public function create(Request $request){
        try{
            //validate fields
            $validateFields = $request->validate([
                'name' => "required|string",
                'ice'=>"required|string",
                "adresse" => "required|string",
                'phone' => "string|nullable",
                "email" => "email|nullable",
                "picture" => "image|nullable",
                "description" => "string|nullable",
            ]);
            //upload image
            if (isset($validateFields["picture"]) && !empty($validateFields["picture"])) {
                $validateFields["picture"] = parent::upload_picture($validateFields["picture"]);
            }
            //create supplier
            $supplier = Supplier::create($validateFields);
            $supplier->total = 0;
            $supplier->purchases = 0;
            $supplier->active = 1;
            return response(["message" => "success", "data" => $supplier], Response::HTTP_OK);

        }catch(Exception $err){
            return response(["message"=>$err->getMessage()],Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * update supplier
     */
    public function update(Request $request){
        try{
            //validate fields
            $id = $request->route("id");
            $validateFields = $request->validate([
                'name' => "required|string",
                'ice' => "required|string",
                "adresse" => "required|string",
                'phone' => "nullable|string",
                "email" => "email|nullable",
                "picture" => "image",
                "active" => "boolean",
                "description" => "string|nullable",
            ]);
            //get the supplier
            $supplier = Supplier::find($id);
            //update picture
            $pictureName = $supplier->picture;
            if (isset($validateFields["picture"]) && !empty($validateFields["picture"])) {
                $pictureName = parent::update_picture($validateFields["picture"], $supplier);
            }
            //update supplier
            $supplier->update([
                'name' => $validateFields["name"],
                'phone' => $validateFields["phone"],
                'ice' => $validateFields["ice"],
                "adresse" => $validateFields["adresse"],
                "email" => $validateFields["email"],
                "picture" => $pictureName,
                "active" => $validateFields["active"],
                "description" => $validateFields["description"]
            ]);
            $result = 0;
            for ($j = 0; $j < count($supplier->purchases); $j++) {
                $result += $supplier->purchases[$j]->totalPurchase();
            }
            $data = collect([
                "id" => $supplier->id,
                "name" => $supplier->name,
                "adresse" => $supplier->adresse,
                "ice" => $supplier->ice,
                "phone" => $supplier->phone,
                "active" => $supplier->active,
                "email" => $supplier->email,
                "picture" => $supplier->picture,
                "description" => $supplier->description,
                "total" => $result,
                "purchases" => count($supplier->purchases),
            ]);
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get one for edit manage
     * @param Request $request
     * @return response
     */
    public function getOneManage(Request $request)
    {
        try {
            $id = $request->route("id");
            $supplier = Supplier::find($id);
            return response(["message" => "success", "data" => $supplier], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get all active suppliers
     * @param Request $request
     * @return response
     */
    public function getAllActive(Request $request)
    {
        try {
            $suppliers = Supplier::where("active", "=", 1)->get();
            return response(["message" => "success", "data" => $suppliers], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get all supplier include disactive 
     */
    public function getAll(Request $request)
    {
        try {
            $suppliers = Supplier::all();
            $data = [];
            for ($i = 0; $i < count($suppliers); $i++) {
                $result = 0;
                for ($j = 0; $j < count($suppliers[$i]->purchases); $j++) {
                    $result += $suppliers[$i]->purchases[$j]->totalPurchase();
                }
                $data[] = collect([
                    "id" => $suppliers[$i]->id,
                    "name" => $suppliers[$i]->name,
                    "adresse" => $suppliers[$i]->adresse,
                    "ice" => $suppliers[$i]->ice,
                    "phone" => $suppliers[$i]->phone,
                    "active" => $suppliers[$i]->active,
                    "email" => $suppliers[$i]->email,
                    "picture" => $suppliers[$i]->picture,
                    "description" => $suppliers[$i]->description,
                    "total" => $result,
                    "purchases" => count($suppliers[$i]->purchases),
                ]);
            }
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * remove one 
     * @param Request $request
     * @return response
     */
    public function delete(Request $request)
    {
        try {
            $id = $request->route("id");
            $supplier = Supplier::find($id);
            $this->delete_picture($supplier);
            $supplier->delete();
            return response(["message" => "success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get the supplier for single page
     * @param Request $request [filter type, date start, date end]
     * @return response {supplier infos - supplier purchase graph - supplier purchase list } 
     */
    public function getOneSingle(Request $request)
    {
        try {
            $id = $request->route("id");
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "nullable",
                "endDate" => "nullable"
            ]);
            $supplier = Supplier::find($id);
            $filter = [];
            $days = [];
            $prefix = "";
            $filterTitle = "Current Week";
            switch ($validateFields['filter']) {
                case "today":
                    $filter = [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()];
                    $filterType = "HOUR(purchases.created_at) as date";
                    $days = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
                    $prefix = "hour";
                    $filterTitle = "Today";
                    break;
                case "yesterday":
                    $filter = [Carbon::yesterday()->startOfDay(), Carbon::yesterday()->endOfDay()];
                    $filterType = "HOUR(purchases.created_at) as date";
                    $days = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
                    $prefix = "hour";
                    $filterTitle = "Yesterday";
                    break;
                case "month":
                    //code
                    $filter = [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()];
                    $filterType = "DATE(purchases.created_at) as date";
                    $days = $this->daysOfMonth();
                    $prefix = "day";
                    $filterTitle = "Current Month";
                    break;
                case "year":
                    //code
                    $filter = [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()];
                    $filterType = "MONTH(purchases.created_at) as date";
                    $days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                    $prefix = "month";
                    $filterTitle = "Current Year";
                    break;
                case "range":
                    //get date 
                    $timeStart = strtotime($validateFields["startDate"]);
                    $timeEnd = strtotime($validateFields["endDate"]);
                    $filter = [date("Y-m-d", $timeStart), date("Y-m-d", $timeEnd + 86400)];
                    $filterType = "DATE(purchases.created_at) as date";
                    $days = $this->daysOfRange($validateFields["startDate"], $validateFields["endDate"]);
                    $prefix = "day";
                    $filterTitle = "from " . date("Y-m-d", $timeStart) . "to" . date("Y-m-d", $timeEnd);
                    break;
                default:
                    $filter = [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()];
                    $filterType = "DATE(purchases.created_at) as date";
                    $days = $this->daysOfWeek();
                    $prefix = "day";
                    $filterTitle = "Current Week";
            }
            $purchasesStatistics = Supplier::join("purchases", "suppliers.id", "=", "purchases.supplier_id")
            ->join("stocks", "purchases.id", "=", "stocks.purchase_id")
            ->where("suppliers.id", "=", $id)
                ->whereBetween('purchases.created_at', $filter)
                ->select(
                    DB::raw($filterType),
                    DB::raw('COUNT(DISTINCT purchases.id) as order_count'),
                )
                ->groupBy("date")
                ->orderBy('date')
                ->get();
            $purchases = Supplier::join("purchases", "suppliers.id", "=", "purchases.supplier_id")
            ->join("stocks", "purchases.id", "=", "stocks.purchase_id")
            ->join("users", "purchases.user_id", "=", "users.id")
            ->where("suppliers.id", "=", $id)
                ->whereBetween('purchases.created_at', $filter)
                ->select(
                    "users.name as user",
                    DB::raw($filterType),
                    DB::raw('purchases.id as id'),
                    DB::raw('SUM(stocks.stock_init) as qnt'),
                    DB::raw('SUM((stocks.price * stocks.stock_init)) as total')
                )
                ->groupBy("id")
                ->orderBy('date')
                ->get();
            $supplier->filterTitle = $filterTitle;
            $supplier->purchasesStatistics = parent::prepareSales($purchasesStatistics, $days, $prefix);
            $supplier->purchases = $purchases;
            return response(["message" => "success", "data" => $supplier], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}

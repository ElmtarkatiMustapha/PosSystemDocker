<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    /**
     * create category 
     * @param request
     * @return response
     */
    public function create(Request $request){
        try{
            $validateFields = $request->validate(
                [
                    "name" => "required|string",
                    "desc" => "string|nullable",
                    "picture" => "image|nullable",
                ]
            );
            //upload picture
            $pictureName = "";
            if(isset($validateFields["picture"]) && !empty($validateFields["picture"])){
                $pictureName = parent::upload_picture($validateFields["picture"]);
            }
            //create Category
            $category = Category::create([
                "name"=>$validateFields["name"],
                "description" => $validateFields["desc"],
                "picture"=>$pictureName
            ]);
            $category->nbOrders = 0;
            $category->turnover = 0;
            $category->nbProducts = 0;
            return response(["message" => "success", "data" =>  $this->dataStructure($category)], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * update category infos
     * @param request
     * @return response
     */
    public function update(Request $request){
        try{
            $id = $request->route("id");
            $validateFields = $request->validate(
                [
                    "name" => "required|string",
                    "desc" => "string|nullable",
                    "picture" => "image|nullable",
                    "active" => "boolean",
                ]
            );
            $category = Category::withCount("products as nbProducts")->find($id);
            //remove the old picture if uploaded
            $pictureName = $category->picture;
            if (isset($validateFields["picture"]) && !empty($validateFields["picture"])) {
                $pictureName = parent::update_picture($validateFields["picture"],$category);
            }
            //update category
            $category->update([
                "name"=>$validateFields["name"],
                "active" => $validateFields["active"],
                "picture" => $pictureName,
                "description" => $validateFields["desc"]
            ]);
            //get with turnover 
            $category->nbOrders = count($category->orders());
            $result = 0;
            if (
                $category->nbProducts > 0
            ) {
                foreach ($category->products as $product) {
                    $result += $product->details_order->reduce(function ($total, $item) {
                        $total += $item->price * $item->qnt;
                        //we need to minus the discount
                        $discount = $item->price * $item->discount / 100;
                        $total -= $discount;
                        return $total;
                    });
                }
            }
            $category->turnover = $result;
            $newCategory = $this->dataStructure($category);
            return response(
                ["message" => "success", "data" => $newCategory],
                Response::HTTP_OK
            );
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * get category infos
     * @param request
     * @return category_infos
     */
    public function getOne(Request $request){
        try{
            //validate fields
            $id = $request->route("id");
            $category = Category::find($id);
            if(empty($category)){
                throw new Exception("no category matches");
            }
            return response(["message" => "success", "data" => $category], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST); 
        }
    }
    public function getAllActive()
    {
        try {
            $categories = Category::where("active", 1)->get();
            return response(["message" => "success", "data" => $categories], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getAll()
    {
        /**
         * data to return
         * id 
         * name
         * image
         * number of Product
         * turnover
         * number of sales
         */
        try {
            $categories = Category::withCount("products as nbProducts")->orderBy("name", 'asc')->get();
            $newList = [];
            for ($i = 0; $i < count($categories); $i++) {
                $categories[$i]->nbOrders = count($categories[$i]->orders());
                $result = 0;
                if (
                    $categories[$i]->nbProducts > 0
                ) {
                    foreach ($categories[$i]->products as $product) {
                        $result += $product->details_order->reduce(function ($total, $item) {
                            $total += $item->price * $item->qnt;
                            //we need to minus the discount
                            $discount = $item->price * $item->discount / 100;
                            $total -= $discount;
                            return $total;
                        });
                    }
                }
                $categories[$i]->turnover = $result;
                $newList[] = $this->dataStructure($categories[$i]);
            }
            return response(["message" => "success", "data" => $newList], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function delete(Request $request)
    {
        try{
            $id = $request->route("id");
            $category = Category::find($id);
            $category->products()->delete();
            $this->delete_picture($category);
            $category->delete();
            return $this->getAll();
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function dataStructure($category)
    {
        return
            collect([
                "id" => $category->id,
                "name" => $category->name,
                "description" => $category->description,
                "active" => $category->active,
                "picture" => $category->picture,
                "nbProducts" => $category->nbProducts,
                "nbOrders" => $category->nbOrders,
                "turnover" => $category->turnover,
            ]);
    }
    /**
     * get data about catgeory
     * @param Request $request(id,filterDate)
     * @return 
     * static data 
     * staticData: {
     *  id,name,description,nbProduct
     * }
     * dynamic data
     * dynamicData:{
     * topProduct,sales,turnover
     * }
     */
    public function singlePage(Request $request)
    {
        try {
            $id = $request->route("id");
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => ""
            ]);
            //get static data
            $staticData = $this->getStructedOne($id);
            //get dynamic data
            //case when filter == "week"
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
                    $days = parent::daysOfMonth();
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
                    $days = parent::daysOfRange($validateFields["startDate"], $validateFields["endDate"]);
                    $prefix = "day";
                    $filterTitle = "from " . date("Y-m-d", $timeStart) . "to" . date("Y-m-d", $timeEnd);
                    break;
                default:
                    $filter = [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()];
                    $filterType = "DATE(orders.created_at) as date";
                    $days = parent::daysOfWeek();
                    $prefix = "day";
                    $filterTitle = "Current Week";
            }
            //get sales
            $sales = Category::join('products', 'categories.id', '=', 'products.category_id')
            ->join('details_orders', 'details_orders.product_id', '=', 'products.id')
            ->join('orders', 'details_orders.order_id', '=', 'orders.id')
                ->where(
                    'categories.id',
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
            //get top Ptoducts
            $products = Product::leftJoin("details_orders", "details_orders.product_id", "=", "products.id")
                ->where('category_id', '=', $id)
                ->whereBetween('details_orders.created_at', $filter)
                ->select(
                    DB::raw("products.id as idPro"),
                    DB::raw("products.barcode"),
                    DB::raw("products.name"),
                    DB::raw("products.picture"),
                    DB::raw("SUM(details_orders.qnt) as quantity"),
                    DB::raw("SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as turnover")
                )
                ->groupBy("idPro")
                ->orderBy("quantity", "desc")
                ->limit(10)
                ->get();
            //prepareData
            $allData = collect([
                "info" => $staticData,
                'filterTitle' => $filterTitle,
                "sales" => parent::prepareSales($sales, $days, $prefix),
                "turnover" => parent::prepareTurnover($sales, $days, $prefix),
                "products" => $products
            ]);
            // date("Y-m-d", strtotime(Carbon::now()->weekday(1)))
            return response(["message" => "success", "data" => $allData], Response::HTTP_OK);
            // return response(["message" => "success", "data" => $allData], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function getStructedOne($id)
    {
        $category = Category::withCount("products as nbProducts")->find($id);
        $category->nbOrders = count($category->orders());
        $result = 0;
        if (
            $category->nbProducts > 0
        ) {
            foreach ($category->products as $product) {
                $result += $product->details_order->reduce(function ($total, $item) {
                    $total += $item->price * $item->qnt;
                    //we need to minus the discount
                    $discount = $item->price * $item->discount / 100;
                    $total -= $discount;
                    return $total;
                });
            }
        }
        $category->turnover = $result;
        return $this->dataStructure($category);
    }
    

}

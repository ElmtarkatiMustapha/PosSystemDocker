<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Stock;
use Carbon\Carbon;
use Error;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Expr\Cast\Bool_;
use Ramsey\Uuid\Type\Integer;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Response as ResponseFacades;


class ProductController extends Controller
{
    /**
     * create products
     * @param Request
     * @return response function
     */
    public function create(Request $request){
        try{
            //validate fields
            $validateFields = $request->validate(["barcode" => "required|string",
                "name" => "required|string",
                "wholesales_price" => "required|numeric",
                "retail_price" => "required|numeric",
                "cachier_margin" => "numeric|nullable",
                "discount" => "numeric|nullable",
                "enable_stock" => "boolean",
                "expires" => "boolean",
                "current_stock" => "integer|nullable",
                "purchase_price" => "integer|nullable",
                "picture" => "image|nullable",
                "category_id" => "required",
            ]);
            $checkBarcode = Product::where("barcode", "=", $validateFields["barcode"])->get();
            if (
                $checkBarcode->count() > 0
            ) {
                throw new Exception("barcode already exist");
            }
            //upload picture
            $pictureName = "";
            if (isset($validateFields["picture"]) && !empty($validateFields["picture"])) {
                $pictureName = parent::upload_picture($validateFields["picture"]);
            }
            //add product to the database
            $product = Product::create([
                "barcode" => $validateFields["barcode"],
                "name" => $validateFields["name"],
                "wholesales_price" => $validateFields["wholesales_price"],
                "retail_price" => $validateFields["retail_price"],
                "discount" => $validateFields["discount"],
                "cachier_margin" => $validateFields["cachier_margin"],
                "enable_stock" => (bool)$validateFields["enable_stock"],
                "expires" => (bool)$validateFields["expires"],
                "picture" => $pictureName,
                "active" => 1,
                "category_id" => $validateFields["category_id"],
            ]);
            if (isset($validateFields["current_stock"]) && !empty($validateFields["current_stock"])) {
                $product->stocks()->create([
                    'stock_actuel' => $validateFields["current_stock"],
                    'stock_init' => $validateFields["current_stock"],
                    'price' => $validateFields["purchase_price"],
                    "purchase_id" => 0,
                ]);
                $product->stocks = $validateFields["current_stock"];
            } else {
                $product->stocks = -1;
            }
            $product->nbOrders = 0;
            //return response
            return response(["message" => "success", "data" => $product], Response::HTTP_OK);

        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * update product infos
     * @param Request
     * @return response function 
     */
    public function update(Request $request){
        try{
            //validate fields
            $id = $request->route("id");
            $validateFields = $request->validate([
                "barcode" => "required|string",
                "name" => "required|string",
                "wholesales_price" => "required|numeric",
                "retail_price" => "required|numeric",
                "cachier_margin" => "numeric|nullable",
                "discount" => "numeric|nullable",
                "active" => "boolean",
                "enable_stock" => "boolean",
                "expires" => "boolean",
                "picture" => "image|nullable",
                "category_id" => "required",
            ]);
            $checkBarcode = Product::where("barcode", "=", $validateFields["barcode"])->get();
            if (
                $checkBarcode->count() > 0 && $checkBarcode[0]->id != $id
            ) {
                throw new Exception("barcode already exist");
            }
            //get Product
            $product = Product::find($id);
            // update picture
            $pictureName = $product->picture;
            if (isset($validateFields["picture"]) && !empty($validateFields["picture"])) {
                $pictureName = parent::update_picture($validateFields["picture"], $product);
            }
            $product->update([
                "barcode" => $validateFields["barcode"],
                "name" => $validateFields["name"],
                "wholesales_price" => $validateFields["wholesales_price"],
                "retail_price" => $validateFields["retail_price"],
                "cachier_margin" => $validateFields["cachier_margin"],
                "discount" => $validateFields["discount"],
                "active" => (bool)$validateFields["active"],
                "enable_stock" => (bool)$validateFields["enable_stock"],
                "expires" => (bool)$validateFields["expires"],
                "picture" => $pictureName,
                "category_id" => $validateFields["category_id"],
            ]);
            $stocks = $product->stocks()->sum("stock_actuel");
            $nbOrders = count($product->orders());
            $product = collect([
                "id" => $product->id,
                "name" => $product->name,
                "barcode" => $product->barcode,
                "picture" => $product->picture,
                "wholesales_price" => $product->wholesales_price,
                "retail_price" => $product->retail_price,
                "discount" => $product->discount,
                "cachier_margin" => $product->cachier_margin,
                "active" => $product->active,
                "enable_stock" => $product->enable_stock,
                "expires" => $product->expires,
                "stocks" => $product->enable_stock ? $stocks : -1,
                "nbOrders" => $nbOrders
            ]);

            return response(["message" => "success", "data" => $product], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * delet products 
     * 
     */
    public function delete(Request $request)
    {
        try {
            $id = $request->route("id");
            $product = Product::find($id);
            $product->stocks()->delete();
            $this->delete_picture($product);
            $product->delete();
            return response(["message" => "success"], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST); 
        }
    }
    /**
     * get all products
     * 
     */
    public function getAllActive()
    {
        try{
            $products = Product::where("active",1)->get();
            // $products = Product::all();
            $allProduct = [];
            foreach ($products as $item) {
                $stocks = $item->stocks()->sum("stock_actuel");
                $nbOrders = count($item->orders());
                $allProduct[] = collect([
                    "id" => $item->id,
                    "name" => $item->name,
                    "barcode" => $item->barcode,
                    "picture" => $item->picture,
                    "wholesales_price" => $item->wholesales_price,
                    "retail_price" => $item->retail_price,
                    "discount" => $item->discount,
                    "cachier_margin" => $item->cachier_margin,
                    "active" => $item->active,
                    "enable_stock" => $item->enable_stock,
                    "stocks" => $item->enable_stock ? $stocks : -1,
                    "nbOrders" => $nbOrders,
                    "category_id" => $item->category_id
                ]);
            }
            return response(["message" => "success", "data" => $allProduct], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get one
     */
    public function getOne(Request $request){
        try{
            $id = $request->route("id");
            $product = Product::find($id);
            //if product not active return error
            if($product->active == 0){
                return response(["message" => "product enable"], Response::HTTP_BAD_REQUEST);
            }
            //if product has enable stock set qntMax to -1
            if($product->enable_stock == 0){
                return response(["message" => "success", "data" =>["product"=>$product,"maxQnt"=> -1]], Response::HTTP_OK);
            }
            //if stock is disable
            $productStock = Stock::where("product_id", $id)->where("stock_actuel", ">", 0)->sum('stock_actuel');
            if($productStock == 0){
                return response(["message" => "product out of stock"], Response::HTTP_BAD_REQUEST);
            }
            $expired_at = Stock::where("product_id", $id)->where("stock_actuel", ">", 0)->oldest()
                ->first();
            //if product out of stock
            $product["expired_at"] = $expired_at->expired_at;
            //default return 
            return response(["message" => "success", "data" => ["product" => $product, "maxQnt" => $productStock]], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getOneManage(Request $request)
    {
        try {
            $id = $request->route("id");
            $product = Product::find($id);
            if ($product->enable_stock == 1) {
                $product->current_stocks = $product->stocks()->sum("stock_actuel");
            } else {
                $product->current_stocks = -1;
            }
            $categories = Category::all();
            return response(["message" => "success", "data" => $product, "categories" => $categories], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getOneSingle(Request $request)
    {
        try {
            $id = $request->route("id");
            $product = Product::find($id);
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => ""
            ]);
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
            $sales = Product::join('details_orders', 'details_orders.product_id', '=', 'products.id')
            ->join('orders', 'details_orders.order_id', '=', 'orders.id')
            ->where(
                'products.id',
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

            if ($product->enable_stock == 1) {
                $product->current_stocks = $product->stocks()->sum("stock_actuel");
            } else {
                $product->current_stocks = -1;
            }
            $product->stocks = $product->stocks;
            $product->filterTitle = $filterTitle;
            $product->sales = parent::prepareSales($sales, $days, $prefix);
            $product->turnover = parent::prepareTurnover($sales, $days, $prefix);
            return response(["message" => "success", "data" => $product], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function getAll()
    {
        try {
            $products = Product::all();
            $allProduct = [];
            foreach ($products as $item) {
                $stocks = $item->stocks()->sum("stock_actuel");
                $nbOrders = count($item->orders());
                $allProduct[] = collect([
                    "id" => $item->id,
                    "name" => $item->name,
                    "barcode" => $item->barcode,
                    "picture" => $item->picture,
                    "wholesales_price" => $item->wholesales_price,
                    "retail_price" => $item->retail_price,
                    "discount" => $item->discount,
                    "cachier_margin" => $item->cachier_margin,
                    "active" => $item->active,
                    "enable_stock" => $item->enable_stock,
                    "stocks" => $item->enable_stock ? $stocks : -1,
                    "nbOrders" => $nbOrders,
                    "category_id" => $item->category_id
                ]);
            }
            return response(["message" => "success", "data" => $allProduct], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * search for a prooduct 
     * if product out of stock @return error
     * else @return product 
     * @param Request $request
     */
    public function searchText(Request $request){
        try{
            $searchText = $request->route("searchText");
            $products = Product::where("active", 1)
            ->where(function (Builder $query) use ($searchText) {
                $query->where("barcode", "like", $searchText . "%")
                ->orWhere("name", "like", $searchText . "%");
            })
            ->select('products.*', DB::raw('(SELECT SUM(stock_actuel) FROM stocks WHERE product_id = products.id) AS maxQnt'))
            ->get();
            /**
             * check if number of products > 1
             */
            if($products->count() > 1){
                return response(["message" => "success","products"=>$products], Response::HTTP_OK);
            }
            if($products->count() == 1 && $products[0]->enable_stock == 1){
                if($products[0]->expires == 1){
                    $expired_at = Stock::where("product_id", $products[0]->id)->where("stock_actuel", ">", 0)->oldest()
                        ->first();
                    $products[0]->expired_at = $expired_at->expired_at;
                }
                if( ((int)$products[0]->maxQnt) > 0  ){
                    return response(["message" => "success","products"=>$products], Response::HTTP_OK);
                }else{
                    return response(["message" => "product out of stock"], Response::HTTP_BAD_REQUEST);
                }
            }else{
                $products[0]->maxQnt = -1;
                return response(["message" => "success", "products" =>$products], Response::HTTP_OK);
            }
            return response(["message" => "No Product","data"=>$products], Response::HTTP_BAD_REQUEST);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * search for a product and return it without contraint of stock
     */
    public function searchPurchaseText(Request $request)
    {
        try {
            $searchText = $request->route("searchText");
            $products = Product::where("active", 1)
            ->where(function (Builder $query) use ($searchText) {
                $query->where("barcode", "like", $searchText . "%")
                    ->orWhere("name", "like", $searchText . "%");
            })
                ->select('products.*', DB::raw('(SELECT SUM(stock_actuel) FROM stocks WHERE product_id = products.id) AS stocks'))
                ->get();
            /**
             * check if number of products > 1
             */
            if ($products->count() > 1) {
                return response(["message" => "success", "products" => $products], Response::HTTP_OK);
            }
            if ($products->count() == 1 && $products[0]->enable_stock == 1) {
                return response(["message" => "success", "products" => $products], Response::HTTP_OK);
            }
            return response(["message" => "No Product"], Response::HTTP_BAD_REQUEST);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function deleteStock(Request $request)
    {
        try {
            $id = $request->route("id");
            $validateFields = $request->validate([
                "stock_id" => "required|integer"
            ]);
            Stock::find($validateFields["stock_id"])->delete();
            $product = Product::find($id);
            return response(["message" => "success", "data" => $product->stocks], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function checkStock($id, $qnt)
    {
        $product = Product::find($id);
        //if product not active return error
        if ($product->active == 0) {
            throw new Error("product " . $product->barcode . "disable");
        }
        //if product has enable stock 
        if ($product->enable_stock == 0) {
            return true;
        }
        //if stock is disable
        $productStock = Stock::where("product_id", $id)->where("stock_actuel", ">", 0)->sum('stock_actuel');
        //if product out of stock
        if ($productStock < $qnt) {
            throw new Error("product " . $product->barcode . " out of stock");
        }
        return true;
    }
    /**
     * add stock to the product
     */
    public function addStock(Request $request)
    {
        try {
            $id = $request->route("id");
            $validateFields = $request->validate([
                "stock_init" => "required|numeric",
                "stock_current" => "required|numeric",
                "price" => "required|numeric",
                "expires" => "date",
            ]);
            if (!isset($validateFields["expires"]) || empty($validateFields["expires"])) {
                $validateFields["expires"] = null;
            }
            $stockControlle = new StockController();
            $product = Product::Find($id);
            $purchase = new Purchase(["id" => 0]);
            $stockControlle->create($validateFields["price"], $validateFields["expires"], $validateFields["stock_init"], $validateFields["stock_current"], $purchase, $product);
            $product = Product::Find($id);

            return response(["message" => "success", "data" => $product->stocks], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * export data
     */
    public function export(){
        try {
            $products = Product::with("category")->get();
            // generate CSV
            $fileName = "products_list_export_" . date('Y-m-d_H-i-s') . ".csv";
            $headers = [
                "Content-type" => "text/csv; charset=UTF-8",
                "Content-Disposition" => "attachment; filename=$fileName",
                "Pragma" => "no-cache",
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Expires" => "0",
                "Access-Control-Expose-Headers" => "Content-Disposition" 
            ];

            $columns = ["id","barcode","name","wholesales_price","retail_price","discount","cachier_margin","picture","expires","category_id","active","enable_stock","category_name"];

            $callback = function () use ($products, $columns) {
                $file = fopen('php://output', 'w');
                fputcsv($file, $columns,";");

                foreach ($products as $row) {
                    fputcsv($file, [
                        $row['id'],
                        $row['barcode'],
                        $row['name'],
                        number_format($row['wholesales_price'], 3, ',', ''),
                        number_format($row['retail_price'], 3, ',', ''),
                        number_format($row['discount'], 3, ',', ''),
                        number_format($row['cachier_margin'], 3, ',', ''),
                        $row['picture'],
                        $row['expires'],
                        $row['category_id'],
                        $row['active'],
                        $row['enable_stock'],
                        $row['category']["name"],
                    ],";");
                }
                fclose($file);
            };

            return ResponseFacades::stream($callback, 200, $headers);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * template 
     */
    public function template(){
        try{
            $fileName = "products_template.csv";
            $headers = [
                "Content-type" => "text/csv; charset=UTF-8",
                "Content-Disposition" => "attachment; filename=$fileName",
                "Pragma" => "no-cache",
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Expires" => "0",
                "Access-Control-Expose-Headers" => "Content-Disposition" 
            ];

            $columns = ["barcode","name","wholesales_price","retail_price","discount","cachier_margin","picture","expires","category_id","active","enable_stock"];

            $callback = function () use ( $columns) {
                $file = fopen('php://output', 'w');
                fputcsv($file, $columns,";");
                fclose($file);
            };

            return ResponseFacades::stream($callback, 200, $headers);

        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    public function import(Request $request){
        try{
            $request->validate([
            'file' => 'required|mimes:csv,txt|max:2048',
        ]);

        $path = $request->file('file')->getRealPath();
        $file = fopen($path, 'r');

        // Read header
        $header = fgetcsv($file, 0, ';');

        $count = 0;
        while (($row = fgetcsv($file, 0, ';')) !== false) {
            $record = array_combine($header, $row);

            Product::updateOrCreate(
                ['barcode' => $record['barcode']],
                [
                    'name'            => $record['name'] ?? null,
                    'wholesales_price'=> $record['wholesales_price'] ?? 0,
                    'retail_price'    => $record['retail_price'] ?? 0,
                    'discount'        => $record['discount'] ?? 0,
                    'expires'         => isset($record['expires']) ? (bool) $record['expires'] : 0,
                    'cachier_margin'  => $record['cachier_margin'] ?? 0,
                    'picture'         => $record['picture'] ?? null,
                    'category_id'     => $record['category_id'] ?? 0,
                    'active'          => isset($record['active']) ? (bool) $record['active'] : 1,
                    'enable_stock'    => isset($record['enable_stock']) ? (bool) $record['enable_stock'] : 1,
                ]
            );
            $count++;
        }

        fclose($file);
            return response(["message" => "import with success"], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}

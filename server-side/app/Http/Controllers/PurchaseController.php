<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Stock;
use Error;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Ramsey\Uuid\Type\Integer;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Response as ResponseFacades;

class PurchaseController extends Controller
{
    /**
     * create  a new purchase
     * data 
     */
    public function create(Request $request)
    {
        try {
            $validateFields = $request->validate([
                "supplier" => "required",
                "cartItems" => "required|array",
                "cartItems.*.product" => "required",
                "cartItems.*.qnt" => "required|integer",
            ]);
            //get the logged user 
            $user = Auth::user();
            //create purchase
            $purchase = Purchase::create([
                "user_id" => $user->id,
                "supplier_id" => $validateFields["supplier"],
            ]);
            //create details purchase (stock)
            $stock = new StockController();
            foreach ($validateFields["cartItems"] as $ligne) {
                $stock->create($ligne["product"]["purchasePrice"], null, $ligne["qnt"],  $ligne["qnt"], $purchase, Product::find($ligne["product"]["id"]));
            }
            //return response
            // return response(["message" => "Purchase Saved with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            throw new Exception($err->getMessage());
        }
    }
    /**
     * save purchase
     */
    public function save(Request $request)
    {
        try {
            $this->create($request);
            //return response
            return response(["message" => "Purchase Saved with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * save and print
     */
    public function savePrint(Request $request)
    {
        try {
            //create purchase
            $this->create($request);
            //print purchase

            //return response
            return response(["message" => "Purchase Saved with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get all purchases
     * attribute to return for purchases: id,supplier,user,qnt,total,date 
     * attribute to return for statistics: purchaseNumber,turnover
     */
    public function getAll(Request $request)
    {
        try {
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => "",
                "supplier" => "numeric"
            ]);
            $filterData = $this->filterData($validateFields, "purchases.created_at");
            $purchases = [];
            $statistics = [];
            if ($validateFields["supplier"] != -1) {
                $purchases = Purchase::join("users", "purchases.user_id", "=", "users.id")
                ->join("suppliers", "purchases.supplier_id", "=", "suppliers.id")
                ->join("stocks", "stocks.purchase_id", "=", "purchases.id")
                ->where("suppliers.id", "=", $validateFields["supplier"])
                ->whereBetween('purchases.created_at', $filterData["filter"])
                ->select(
                    DB::raw("purchases.id as id"),
                    DB::raw("DATE_FORMAT(purchases.created_at,'%d-%m-%Y %H:%i') as date"),
                    DB::raw("suppliers.name as supplier"),
                    DB::raw("users.name as user"),
                    DB::raw("SUM(stocks.stock_init) as qnt"),
                    DB::raw("SUM(stocks.stock_init*stocks.price) as total")
                )->groupBy("id")
                    ->orderBy("date")
                    ->get();
                $statistics = Purchase::join("stocks", "stocks.purchase_id", "=", "purchases.id")
                ->where("purchases.supplier_id", "=", $validateFields["supplier"])
                ->whereBetween('purchases.created_at', $filterData["filter"])
                ->select(
                    DB::raw("COUNT( DISTINCt purchases.id ) as purchasesNumber"),
                    DB::raw("SUM(stocks.stock_init*stocks.price) as total")
                )
                    ->groupBy("purchases.supplier_id")
                    ->get();
            } else {
                $purchases = Purchase::join("users", "purchases.user_id", "=", "users.id")
                ->join("suppliers", "purchases.supplier_id", "=", "suppliers.id")
                ->join("stocks", "stocks.purchase_id", "=", "purchases.id")
                ->whereBetween('purchases.created_at', $filterData["filter"])
                ->select(
                    DB::raw("purchases.id as id"),
                    DB::raw("DATE_FORMAT(purchases.created_at,'%d-%m-%Y %H:%i') as date"),
                    DB::raw("suppliers.name as supplier"),
                    DB::raw("users.name as user"),
                    DB::raw("SUM(stocks.stock_init) as qnt"),
                    DB::raw("SUM(stocks.stock_init*stocks.price) as total")
                )->groupBy("id")
                    ->orderBy("date")
                    ->get();
                $statistics = Purchase::join("stocks", "stocks.purchase_id", "=", "purchases.id")
                ->whereBetween('purchases.created_at', $filterData["filter"])
                ->select(
                    DB::raw("COUNT( DISTINCt purchases.id ) as purchasesNumber"),
                    DB::raw("SUM(stocks.stock_init*stocks.price) as total")
                )
                    ->get();
            }
            if (empty($statistics[0]->purchasesNumber)) {
                $statistics[0] = collect(["purchasesNumber" => 0, "total" => 0]);
            }
            return response(["message" => "success", "data" => collect(["purchases" => $purchases, "statistics" => $statistics[0]])], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @desc delete one
     * @param Request $request (id)
     */
    public function delete(Request $request)
    {
        try {
            $id = $request->route("id");
            $purchase = Purchase::find($id);
            $purchase->stocks()->delete();
            $purchase->delete();
            return response(["message" => "deleted with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @desc get edit purchase 
     * @todo find purchase
     * @todo get purchase data 
     *  codebar: "87868586"
     *  discount: 0
     *  id: 1
     *  name: "chese cake"
     *  purchasePrice: 0
     *  retailPrice:12
     *  stocks: "105"
     *  wholesalePrice: 9.5
     */
    public function getEditPurchase(Request $request)
    {
        try {
            $id = $request->route("id");
            $purchase = Purchase::find($id);
            if (empty($purchase)) {
                throw new Error("something wrong");
            }
            $data = [];
            foreach ($purchase->stocks as $item) {
                array_push(
                    $data,
                    collect([
                        "product" => collect([
                            "id" => $item->product->id,
                            "codebar" => $item->product->barcode,
                            "name" => $item->product->name,
                            "retailPrice" => $item->product->retail_price,
                            "wholesalePrice" => $item->product->wholesales_price,
                            "discount" => $item->product->discount,
                            "purchasePrice" => $item->price,
                            "stocks" => $item->product->enable_stock ? $item->product->stocks()->sum("stock_actuel") : -1,
                        ]),
                        "qnt" => $item->stock_init
                    ])
                );
            }

            $data = collect([
                "cartItems" => $data,
                "supplier" => $purchase->supplier->id
            ]);
            return response(["message" => "send with success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get data for single purchase page
     * @todo get the id 
     * @todo prepare request 
     * @return (purchase_infos, details_purchase)
     */
    public function getSingle(Request $request)
    {
        try {
            $id = $request->route("id");
            $purchase = Purchase::join("stocks", "stocks.purchase_id", "=", "purchases.id")
            ->join("users", "users.id", "=", "purchases.user_id")
            ->join("suppliers", "suppliers.id", "=", "purchases.supplier_id")
            ->where("purchases.id", "=", $id)
                ->select(
                    DB::raw('purchases.id as id'),
                DB::raw("DATE_FORMAT(purchases.created_at,'%d-%m-%Y %H:%i') as date"),
                    DB::raw('users.name as user'),
                    DB::raw('suppliers.name as supplier'),
                    DB::raw('SUM(stocks.stock_init) as qnt'),
                    DB::raw('SUM(stocks.price * stocks.stock_init) as total'),
                )
                ->groupBy("id")
                ->get();
            $details_purchase = Purchase::join("stocks", "stocks.purchase_id", "=", "purchases.id")
            ->join("products", "products.id", "=", "stocks.product_id")
            ->where("purchases.id", "=", $id)
                ->select(
                    DB::raw('stocks.id as id'),
                DB::raw("DATE_FORMAT(purchases.created_at,'%d-%m-%Y %H:%i') as date"),
                    DB::raw('products.name as product'),
                    DB::raw('products.barcode as barcode'),
                    DB::raw('stocks.stock_init as qnt'),
                    DB::raw('stocks.price as price'),
                    DB::raw('(stocks.price * stocks.stock_init) as total'),
                )
                ->get();
            $purchase[0]->details_purchase = $details_purchase;
            return response(["message" => "success", "data" =>  $purchase[0]], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * update purchase 
     * @todo validate data
     * @todo delete stock
     * @todo create stock 
     * @todo update purchase
     */
    public function update(Request $request)
    {
        try {
            //update purchase here
            $validateFields = $request->validate([
                "supplier" => "required",
                "cartItems" => "required|array",
                "cartItems.*.product" => "required",
                "cartItems.*.qnt" => "required|integer",
            ]);
            $id = $request->route("id");
            $purchase = Purchase::find($id);
            if (empty($purchase)) {
                throw new Error("Something wrrong");
            }
            //get user
            $user = Auth::user();
            /**
             * update stock 
             */
            $list = [];
            $list2 = [];
            foreach ($purchase->stocks as $stock) {
                array_push($list, $stock->product_id);
            }
            foreach ($validateFields["cartItems"] as $ligne) {
                array_push($list2, $ligne["product"]["id"]);
                if (in_array($ligne["product"]["id"], $list)) {
                    foreach ($purchase->stocks as $stock) {
                        if ($ligne["product"]["id"] == $stock->product_id) {
                            $stock->update([
                                "stock_actuel" => (int)$stock->stock_actuel + ((int)$ligne["qnt"] - (int)$stock->stock_init),
                                "stock_init" => $ligne["qnt"],
                                "price" => $ligne["product"]["purchasePrice"]
                            ]);
                        }
                    }
                } else {
                    $stockController = new StockController();
                    $stockController->create($ligne["product"]["purchasePrice"], null, $ligne["qnt"],  $ligne["qnt"], $purchase, Product::find($ligne["product"]["id"]));
                }
            }
            /**
             * @desc delete all stock remove from carte
             */
            foreach ($purchase->stocks as $stock) {
                if (!in_array($stock->product_id, $list2)) {
                    $stock->delete();
                }
            }
            return true;
        } catch (Exception $err) {
            throw new Exception($err->getMessage());
            // return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

    public function updatePurchase(Request $request)
    {
        try {
            $this->update($request);
            //return response
            return response(["message" => "Purchase Updated with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @description : this fnction allow exporting purchase based on filters
     * @param Reaquet $request: containe 
     */
    public function export(Request $request){
        try{
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => "",
                "supplier" => "numeric"
            ]);
            $filterData = $this->filterData($validateFields, "purchases.created_at");
            $purchases = [];
            if ($validateFields["supplier"] != -1) {
                $purchases = Purchase::join("users", "purchases.user_id", "=", "users.id")
                ->join("suppliers", "purchases.supplier_id", "=", "suppliers.id")
                ->join("stocks", "stocks.purchase_id", "=", "purchases.id")
                ->where("suppliers.id", "=", $validateFields["supplier"])
                ->whereBetween('purchases.created_at', $filterData["filter"])
                ->select(
                    DB::raw("purchases.id as id"),
                    DB::raw("DATE_FORMAT(purchases.created_at,'%d-%m-%Y %H:%i') as date"),
                    DB::raw("suppliers.name as supplier"),
                    DB::raw("users.name as user"),
                    DB::raw("SUM(stocks.stock_init) as qnt"),
                    DB::raw("SUM(stocks.stock_init*stocks.price) as total")
                )->groupBy("id")
                    ->orderBy("date")
                    ->get();
            } else {
                $purchases = Purchase::join("users", "purchases.user_id", "=", "users.id")
                ->join("suppliers", "purchases.supplier_id", "=", "suppliers.id")
                ->join("stocks", "stocks.purchase_id", "=", "purchases.id")
                ->whereBetween('purchases.created_at', $filterData["filter"])
                ->select(
                    DB::raw("purchases.id as id"),
                    DB::raw("DATE_FORMAT(purchases.created_at,'%d-%m-%Y %H:%i') as date"),
                    DB::raw("suppliers.name as supplier"),
                    DB::raw("users.name as user"),
                    DB::raw("SUM(stocks.stock_init) as qnt"),
                    DB::raw("SUM(stocks.stock_init*stocks.price) as total")
                )->groupBy("id")
                    ->orderBy("date")
                    ->get();
            }
             // CSV file name
        $fileName = "purchases_export_" . date('Y-m-d_H-i-s') . ".csv";

        // Headers
        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        // CSV Columns
        $columns = ['Purchase ID', 'Date', 'Supplier', 'User', 'Quantity', 'Total'];

        // Callback to stream CSV
        $callback = function () use ($purchases, $columns) {
            $file = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Write header
            fputcsv($file, $columns, ";");

            // Write rows
            foreach ($purchases as $row) {
                fputcsv($file, [
                    $row->id,
                    $row->date,
                    $row->supplier,
                    $row->user,
                    number_format($row->qnt, 2, ',', ''),   // force 12,5 format
                    number_format($row->total, 2, ',', '') // same for totals
                ], ";");
            }
            fclose($file);
        };
        return ResponseFacades::stream($callback, 200, $headers);

        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}

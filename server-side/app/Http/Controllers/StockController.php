<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Stock;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Response as ResponseFacades;

use function PHPSTORM_META\type;

class StockController extends Controller
{
    /**
     * create stock
     * @param integer $stock_init
     * @param Purchase $purchase
     * @param Product $product
     */
    public function create($price, $expires, $stock_init, $stock_actuel, Purchase $purchase, Product $product)
    {
        try {
            $stock = Stock::create([
                'stock_actuel' => $stock_actuel,
                'stock_init' => $stock_init,
                'price' => $price,
                'expired_at' => $expires,
                "purchase_id" => $purchase->id,
                "product_id" => $product->id,
            ]);
            return $stock;
        } catch (Exception $err) {
            throw new Exception($err->getMessage());
        }
    }
    /**
     * add one stock
     */

    /**
     * get one record
     */
    public function getOne(Request $request)
    {
        try {
            $stock = Stock::with("product")->find($request->route("id"));
            if (empty($stock)) {
                throw new Exception("data invalide check stock id !!");
            }
            return response(["message" => "success", "data" => $stock], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * update stock
     */
    public function update(Request $request)
    {
        try {
            $id = $request->route("id");
            $validateFields = $request->validate([
                "stock_actuel" => 'required|numeric',
                "stock_init" => 'required|numeric',
                "price" => 'required|numeric',
                "expired_at" => ""
            ]);
            $stock = Stock::find($id);
            $stock->update($validateFields);
            $stock->product = $stock->product;
            $stock->product = $stock->purchase;
            return response(["message" => "success", "data" => $stock], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * delete stock
     */
    public function delete(Request $request)
    {
        try {
            $id =  $request->route("id");
            Stock::find($id)->delete();
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get all stocks
     */
    public function getAll()
    {
        try {
            $stocks = Stock::with(["product", "purchase"])->get();
            return response(["message" => "success", "data" => $stocks], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * stock export 
     */
    public function export(Request $request){
        try{
            $fileName = "stocks_export_" . date('Y-m-d_H-i-s') . ".csv";

            // Headers
            $headers = [
                "Content-type" => "text/csv; charset=UTF-8",
                "Content-Disposition" => "attachment; filename=$fileName",
                "Pragma" => "no-cache",
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Expires" => "0"
            ];

            // CSV Columns
            $columns = [
                'Product ID', 'Barcode', 'Product Name', 'Category',
                'Stock ID', 'Stock Init', 'Stock Current', 'Purchase Price',
                'Total Value', 'Expiry Date', 'Supplier'
            ];

            // Fetch products with stocks + supplier
            $products = Product::with(['category', 'stocks.purchase.supplier'])->get();

            // Callback for CSV streaming
            $callback = function () use ($products, $columns) {
                $file = fopen('php://output', 'w');
                // Add UTF-8 BOM for Excel compatibility
                fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

                // Write header row
                fputcsv($file, $columns, ";");

                // Write data rows
                foreach ($products as $product) {
                    foreach ($product->stocks as $stock) {
                        if ($stock->stock_actuel > 0) {
                            fputcsv($file, [
                                $product->id,
                                $product->barcode,
                                $product->name,
                                $product->category->name ?? null,
                                $stock->id,
                                $stock->stock_init,
                                $stock->stock_actuel,
                                number_format($stock->price, 2, ',', ''), // e.g. 1200,50
                                number_format($stock->stock_actuel * $stock->price, 2, ',', ''),
                                $stock->expired_at,
                                $stock->purchase->supplier->name ?? null
                            ], ";");
                        }
                    }
                }

                fclose($file);
            };
            return ResponseFacades::stream($callback, 200, $headers);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Models\Stock;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

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
}

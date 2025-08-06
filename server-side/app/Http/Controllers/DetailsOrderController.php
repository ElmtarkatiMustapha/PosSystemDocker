<?php

namespace App\Http\Controllers;

use App\Models\Details_order;
use App\Models\Order;
use App\Models\Product;
use App\Models\Stock;
use Error;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DetailsOrderController extends Controller
{
    /**
     * create details order
     * @param Array $details_order
     * @param Order $order
     */
    public function addLigne(Order $order, $ligne){
        try{
            //get the product infos
            $product = Product::find($ligne["id_product"]);
            //create ligne
            Details_order::create([
                "price"=> $order->type == "wholesale"? $product->wholesales_price: $product->retail_price,
                "qnt"=>$ligne["qnt"],
                "margin"=>$product->cachier_margin*$ligne["qnt"],
                "discount"=>$ligne["discount"],
                "order_id"=>$order->id,
                "product_id"=>$product->id
            ]);
            //if stock disable don't decriment stock
            if ($product->enable_stock == 0) {
                return true;
            }
            //decriment stock
            $stocks = $product->stocks()
                ->where("stock_actuel", ">", 0)
                ->oldest()
                ->get();
            if ($stocks->count() == 0) {
                throw new Error("no stock");
            }
            $qnt = $ligne["qnt"];
            foreach ($stocks as $stock) {
                if ($qnt <= $stock->stock_actuel) {
                    Stock::find($stock->id)->update(["stock_actuel" => $stock->stock_actuel -  $qnt]);
                    break;
                } else {
                    $qnt -= $stock->stock_actuel;
                    Stock::find($stock->id)->update(["stock_actuel" => 0]);
                }
            }
            return true;
        }catch(Exception $err){
            // handle errors 
            throw new Exception($err->getMessage());
            return false;
        }
    }
    /**
     * @desc return a line to the stock
     * @param ligne $ligne containe details order info
     * @todo find the last stock
     * @todo update stock (add qnt)
     */
    public function returnLine($ligne)
    {
        try {
            $stock = Stock::where("product_id", "=", $ligne->product_id)
                ->where("stock_actuel", "!=", 0)
                ->oldest()->first();
            if (empty($stock)) {
                $stock = Stock::where("product_id", "=", $ligne->product_id)
                    ->latest()->first();
            }
            $stock->update(["stock_actuel" => $stock->stock_actuel + $ligne->qnt]);
            return true;
        } catch (Exception $err) {
            throw new Exception($err->getMessage());
            return false;
        }
    }
}

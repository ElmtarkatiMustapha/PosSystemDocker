<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Returns;
use App\Models\Sector;
use App\Models\Stock;
use App\Models\Supplier;
use App\Models\User;
use Carbon\Carbon;
use Faker\Factory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class TestController extends Controller
{
    public function test(Request $request){
        // $data = Product::create([
        //     "barcode"=>"234HTT11",
        //     "name"=> "product2",
        //     "wholesales_price"=>10,
        //     "retail_price"=>12,
        //     "cachier_margin"=>0,
        //     "category_id"=>2,
        // ]);

        // $users = User::all();
        // $product->category()->associate($categorie);
        // $product->save();
        // $validateData = $request->validate([
        //     "sector"=> ""
        // ])
        // $sector = Sector::find($request->input("sector"));
        // SectorController::detach($sector);
        // $pictureName =  parent::upload_picture($request->file("picture"));

        // $validateData = $request->validate([
        //     "id_customer" => "required",
        //     "details_order" => "required|array",
        //     "details_order.*.id_product" => "required|integer",
        //     "details_order.*.qnt" => "required|integer",
        //     "details_order.*.discount" => "required|numeric"
        // ]);
        /**
         * create fake data 
         * categories and products
         */
        // $categories = Category::factory()
        // ->count(10)
        //     ->hasProducts(10)
        //     ->create();
        // $products = Product::all();
        // foreach ($products as $item) {
        //     Stock::factory()
        //         ->count(3)
        //         ->for($item)
        //         ->create();
        // }
        // $suppliers = Supplier::factory()
        //     ->count(10)
        //     ->create();
        // $user = User::find(2);
        // $user->sectors()->attach([11,12,13,14,15,16,17,18,19,20]);
        // $categories = Category::withCount("products as nbProducts")->get();
        // $newList = [];
        // for ($i = 0; $i < count($categories); $i++) {
        //     $categories[$i]->NbOrders = count($categories[$i]->orders());
        //     $result = 0;
        //     if (
        //         $categories[$i]->nbProducts > 0
        //     ) {
        //         foreach ($categories[$i]->products as $product) {
        //             // die($product->details_order);
        //             $result += $product->details_order->reduce(function ($total, $item) {
        //                 $total += $item->price * $item->qnt;
        //                 //we need to minus the discount
        //                 $discount = $item->price * $item->discount / 100;
        //                 $total -= $discount;
        //                 return $total;
        //             });
        //         }
        //     }
        //     $categories[$i]->turnover = $result;
        //     $newList[] = collect([
        //         "id" => $categories[$i]->id,
        //         "name" => $categories[$i]->name,
        //         "description" => $categories[$i]->description,
        //         "active" => $categories[$i]->active,
        //         "picture" => $categories[$i]->picture,
        //         "nbProducts" => $categories[$i]->nbProducts,
        //         "NbOrders" => $categories[$i]->NbOrders,
        //         "turnover" => $categories[$i]->turnover,
        //     ]);
        // }
        // $orders = $categories[0]->orders();
        // return response(
        //     $request->picture->extension(),
        //     Response::HTTP_OK
        // );
        // $date = Carbon::createFromFormat("d-m-Y", "25-05-2024");
        // $date = Carbon::createFromTimestamp(strtotime("2024-05-25"));
        // $date = $date->addDay();
        // $date = $date->addDay();
        // $date = $date->addDay();
        // $stock = Stock::where("product_id", "=", 2)
        // ->where("stock_actuel", "!=", 0)
        // ->oldest()->first();
        // if (empty($stock)) {
        //     $stock = Stock::where("product_id", "=", 2)
        //         ->latest()->first();
        // }
        // $order = Order::find(13);
        // $purchase = Purchase::find(7);
        // $list = [];
        // foreach ($purchase->stocks as $stock) {
        //     array_push($list, $stock->product_id);
        // }

        $sales = Order::join(
            'details_orders',
            'details_orders.order_id',
            '=',
            'orders.id'
        )
            ->join(
                'customers',
                'orders.customer_id',
                "=",
                "customers.id"
            )
            ->join(
                'users',
                'orders.user_id',
                "=",
                "users.id"
            )->join(
                "returns",
                "orders.id",
                "=",
                "returns.order_id"
            )
            ->whereBetween('orders.created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
            ->select(
                DB::raw('DATE(orders.created_at) as date'),
                DB::raw('orders.id as id'),
                DB::raw('customers.name as customer'),
                DB::raw('users.name as user'),
                DB::raw('orders.type as type'),
                DB::raw('orders.status as status'),
                DB::raw('SUM(details_orders.qnt) as qnt'),
                DB::raw('SUM(details_orders.price * details_orders.qnt * details_orders.discount / 100) as discount'),
                DB::raw('SUM((details_orders.price * details_orders.qnt) - (details_orders.price * details_orders.qnt * details_orders.discount / 100) ) as total')
            )
            ->groupBy("id")
            ->orderBy('date')
            ->get();
        $returns = Returns::join(
            'details_returns',
            'details_returns.return_id',
            '=',
            'returns.id'
        )
        ->join(
            'orders',
            'returns.order_id',
            "=",
            "orders.id"
        )
            ->join(
                'users',
                'orders.user_id',
                "=",
                "users.id"
            )
            ->whereBetween('returns.created_at', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()])
            ->select(
                DB::raw('returns.id as id'),
                DB::raw('orders.id as sale_id'),
                DB::raw('returns.created_at as created_at'),
                DB::raw('users.name as user'),
                DB::raw('SUM(details_returns.qnt) as qnt'),
                DB::raw('SUM(details_returns.price * details_returns.qnt * details_returns.discount / 100) as discount'),
                DB::raw('SUM((details_returns.price * details_returns.qnt) - (details_returns.price * details_returns.qnt * details_returns.discount / 100) ) as total')
            )
            ->groupBy("id")
            ->orderBy('created_at')
            ->get();

        $updatedData = array_map(function ($item) use ($returns) {
            $item["return_qnt"] = 0;
            foreach ($returns->toArray() as $elem) {
                if (
                    $item["id"] == $elem["sale_id"]
                ) {
                    $item["return_qnt"] = $elem["qnt"];
                    break;
                }
            }
            return $item;
        }, $sales->toArray());
        return response(
            $updatedData,
            Response::HTTP_OK
        );
        
    }
}

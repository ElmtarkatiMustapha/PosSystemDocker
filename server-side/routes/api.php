<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReturnController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StatisticController;
use App\Http\Controllers\StockController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminCachierManager;
use App\Http\Middleware\IsAdmin;
use App\Http\Middleware\IsCachier;
use App\Http\Middleware\IsDelivery;
use App\Http\Middleware\IsManager;
use App\Models\Customer;
use App\Models\Sector;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get('images/{filename}', function ($filename) {
    $path = storage_path('app/images/' . $filename);
    if (!File::exists($path)) {
        abort(404);
    }
    return response()->file($path);
});

Route::post('register',[UserController::class, "create"]);
Route::post('login',[AuthController::class, "login"]);
Route::post('validateUser',[AuthController::class,"validateUser"]);
Route::post("sendVerCode",[AuthController::class, "sendVerCode"]);
Route::post("validateCode",[AuthController::class,"validateCode"]);
Route::post("create_role", [RoleController::class, "create"]);

Route::get("test", [TestController::class, "test2"]);
Route::get("test/{id}", [TestController::class, "test"]);
// Route::get("test/{id}", function () {
//     return response(["message" => "success2"], Response::HTTP_OK);
// });


Route::middleware("auth:sanctum")->group(function (){
    /**these routes for logged user */
    Route::post("resetPassword",[AuthController::class, "resetPassword"]);
    Route::get('user',[AuthController::class,"user"]);
    Route::get('logout', [AuthController::class, "logout"]);
    Route::post("profile", [UserController::class, "profile"]);
    Route::post("profile/{id}", [UserController::class, "updateProfile"]);
    Route::get("settings", [SettingController::class, "getAll"]);
    
    Route::middleware([AdminCachierManager::class])->group(function (){
        /**these shared route between admin, manager, cachier  */
        Route::get('allCategories', [CategoryController::class, "getAll"]);
        
    });
    Route::middleware([IsCachier::class])->group(function (){
        /**these route for admin, cachier user */
        Route::get('product/{id}', [ProductController::class, "getOne"]);
        Route::get('products', [ProductController::class, "getAllActive"]);
        Route::get('searchProduct/{searchText}',[ProductController::class,"searchText"]);
        Route::get("categories", [CategoryController::class, "getAllActive"]);
        Route::get("posSectors", [SectorController::class, "getUserSectors"]);
        Route::get("posCustomers", [CustomerController::class, "userCustomers"]);
        Route::post('saveOrder',[OrderController::class, "create"]);
        Route::post('saveOrderPrint', [OrderController::class, "createPrint"]);
        Route::get("editOrder/{id}", [OrderController::class, "getEditOrder"]);
        Route::post("updateOrder/{id}", [OrderController::class, "updateOrder"]);
        Route::post("updateOrderPrint/{id}", [OrderController::class, "updateOrder"]);
        Route::post("salesUser", [OrderController::class, "getAllCurrentUser"]);
        Route::get("cashierCustomer/{id}", [CustomerController::class, "getOneCashier"]);
        Route::post("cashierCustomer/{id}", [CustomerController::class, "updateCashier"]);
        Route::post("cashierAddCustomer", [CustomerController::class, "create"]);
    });
    Route::middleware([IsDelivery::class])->group(function (){
        /**these route for admin, delivery user */
        Route::get("deliverySectors", [SectorController::class, "getUserSectors"]);
        Route::get("deliverySales", [OrderController::class, "getOrdersToDelivery"]);
        Route::get("deliveryOrder/{id}", [OrderController::class, "getOneOrderToDelivery"]);
        Route::get("deliveredOrder/{id}", [OrderController::class, "getOneOrderDelivered"]);
        Route::post("deliveryOrder/{id}", [OrderController::class, "setDeliveredByUser"]);
        Route::post("deliveredSalesUser", [OrderController::class, "getOrdersDelivered"]);
    });
    Route::middleware([IsManager::class])->group(function (){
        /**these route for admin, manager user */
        Route::get('allUsers', [UserController::class, "getAll"]);
        Route::delete("category/{id}", [CategoryController::class, "delete"]);
        Route::get("category/{id}", [CategoryController::class, "getOne"]);
        Route::post("singleCategory/{id}", [CategoryController::class, "singlePage"]);
        Route::post("category/{id}", [CategoryController::class, "update"]);
        Route::post("create_category", [CategoryController::class, "create"]);
        Route::get("allProducts", [ProductController::class, "getAll"]);
        Route::delete("product/{id}", [ProductController::class, "delete"]);
        Route::post("product/{id}", [ProductController::class, "update"]);
        Route::get('productManage/{id}', [ProductController::class, "getOneManage"]);
        Route::post('productSingle/{id}', [ProductController::class, "getOneSingle"]);
        Route::post('deleteStockProduct/{id}', [ProductController::class, "deleteStock"]);
        Route::post('addProduct', [ProductController::class, "create"]);
        Route::post('product/{id}/addStock', [ProductController::class, "addStock"]);
        Route::get("stock/{id}", [StockController::class, "getOne"]);
        Route::post("stock/{id}", [StockController::class, "update"]);
        Route::delete("stock/{id}", [StockController::class, "delete"]);
        Route::get("stocks", [StockController::class, "getAll"]);
        Route::get("allSectors", [SectorController::class, "getAll"]);
        Route::delete("sector/{id}", [SectorController::class, "delete"]);
        Route::get("sector/{id}", [SectorController::class, "getOne"]);
        Route::post("sector/{id}", [SectorController::class, "update"]);
        Route::post("addSector", [SectorController::class, "create"]);
        Route::post("sectorSingle/{id}", [SectorController::class, "getOneSingle"]);
        Route::post("detachUserSector/{id}", [SectorController::class, "detachOne"]);
        Route::get("allCustomers", [CustomerController::class, "getAll"]);
        Route::get("customer/{id}", [CustomerController::class, "getOne"]);
        Route::post("customer/{id}", [CustomerController::class, "update"]);
        Route::post("addCustomer", [CustomerController::class, "create"]);
        Route::delete("customer/{id}", [CustomerController::class, "delete"]);
        Route::post("singleCustomers/{id}", [CustomerController::class, "getOneSingle"]);
        Route::get("allSuppliers", [SupplierController::class, "getAll"]);
        Route::post("addSupplier", [SupplierController::class, "create"]);
        Route::get("supplierManage/{id}", [SupplierController::class, "getOneManage"]);
        Route::post("supplier/{id}", [SupplierController::class, "update"]);
        Route::delete("supplier/{id}", [SupplierController::class, "delete"]);
        Route::post("singleSupplier/{id}", [SupplierController::class, "getOneSingle"]);
        Route::get("pendingOrders", [OrderController::class, "getPending"]);
        Route::post("setReadyOrder", [OrderController::class, "setReady"]);
        Route::post("setAllReady", [OrderController::class, "setAllReady"]);
        
        /**
         * these routes for returns
         */
        Route::post("saveReturn/{id}", [OrderController::class, "saveReturn"]);
        Route::post("returns", [ReturnController::class, "getAll"]);
        Route::post("returns/export", [ReturnController::class, "export"]);
        Route::get("return/{id}", [ReturnController::class, "getOne"]);
        Route::get("returnToEdit/{id}", [ReturnController::class, "getOneToEdit"]);
        Route::delete("return/{id}", [ReturnController::class, "delete"]);
        Route::post("return/{id}", [ReturnController::class, "update"]);
        Route::middleware([IsAdmin::class])->group(function () {
            /**
             * these routes for sectors
             */
            Route::post("add_sector", [SectorController::class, "create"]);
            Route::post("delete_sector", [SectorController::class, "destroy"]);
            Route::post("update_sector", [SectorController::class, "update"]);
            /**
             * these routes for categories
             */
            Route::post("update_category", [CategoryController::class, "update"]);
            Route::get("get_category", [CategoryController::class, "getOne"]);

            /**
             * these route for purchases
             */
            Route::get('searchPurchaseProduct/{searchText}', [ProductController::class, "searchPurchaseText"]);
            Route::post('savePurchase', [PurchaseController::class, "save"]);
            Route::post('savePrintPurchase', [PurchaseController::class, "savePrint"]);
            Route::post('purchases', [PurchaseController::class, "getAll"]);
            Route::delete('purchase/{id}', [PurchaseController::class, "delete"]);
            Route::get("purchase/{id}", [PurchaseController::class, "getSingle"]);
            Route::get("editPurchase/{id}", [PurchaseController::class, "getEditPurchase"]);
            Route::post("updatePurchase/{id}", [PurchaseController::class, "updatePurchase"]);
            Route::get("posSuppliers", [SupplierController::class, "getAllActive"]);
            /**
             * these routes for user
             */
            
            Route::get('user/{id}', [UserController::class, "getOne"]);
            Route::post("singleUser/{id}", [UserController::class, "getSingle"]);
            Route::post("payEarning/{id}", [UserController::class, "payEarning"]);
            Route::post('user/{id}', [UserController::class, "update"]);
            Route::delete('user/{id}', [UserController::class, "delete"]);
            Route::post('addUser', [UserController::class, "create"]);
            Route::get('userManage/{id}', [UserController::class, "getOneManage"]);
            Route::get("allRoles", [RoleController::class, "getAll"]);
            Route::post("add_user", [UserController::class, "create"]);
            Route::post("update_user", [UserController::class, "update"]);
            Route::post("sync_sectors", [UserController::class, "sync_sectors"]);
            Route::get("user_infos", [UserController::class, "getOne"]);
            Route::post("reset_user_pass", [UserController::class, "reset_pass"]);
            /***
             * these routes for sales 
             */
            Route::post("sales", [OrderController::class, "getAll"]);
            Route::delete("sale/{id}", [OrderController::class, "delete"]);
            Route::get("sale/{id}", [OrderController::class, "getSingle"]);
            Route::post("sendSalesReport", [OrderController::class, "sendReport"]);
            Route::post("sales/export", [OrderController::class, "export"]);
            Route::post("deliveredSale/{id}", [OrderController::class, "setDelivered"]);
            Route::post("pendingSale/{id}", [OrderController::class, "setPending"]);
            Route::get("saleReturn/{id}", [OrderController::class, "saleReturn"]);
            /**
             * these route for spent
             */
            Route::post("addSpent", [ExpenseController::class, "create"]);
            Route::post("spents", [ExpenseController::class, "getAll"]);
            Route::delete("spent/{id}", [ExpenseController::class, "delete"]);
            Route::get("spent/{id}", [ExpenseController::class, "getOne"]);
            Route::post("spent/{id}", [ExpenseController::class, "update"]);
            
            /**
             * these routes for statistics
             */
            Route::post("statistics", [StatisticController::class, "getAll"]);
            /**
             * these routes for settings
             */
            Route::get("settings/business", [SettingController::class, "getBusiness"]);
            Route::post("settings/business", [SettingController::class, "updateBusiness"]);
            Route::get("settings/alert", [SettingController::class, "getAlert"]);
            Route::post("settings/alert", [SettingController::class, "updateAlert"]);
            Route::get("settings/pos", [SettingController::class, "getPos"]);
            Route::post("settings/pos", [SettingController::class, "updatePos"]);
            Route::get("settings/printer/{id}", [SettingController::class, "getPrinter"]);
            Route::post("settings/printer/add", [SettingController::class, "addPrinter"]);
            Route::delete("settings/printer/{id}", [SettingController::class, "removePrinter"]);
            Route::post("settings/printer/{id}", [SettingController::class, "updatePrinter"]);
            Route::get("settings/printers", [SettingController::class, "getAllPrinters"]);
        });
    });

    

});
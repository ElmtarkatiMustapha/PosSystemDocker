<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Sector;
use App\Models\Customer;
use PDO;
use Exception;


class InstallationController extends Controller
{
    //
    public function install(Request $request){
        try {
            $validateFields = $request->validate([
                "stock_alert" => "required|numeric",
                "stock_expiration" => "required|numeric",
                "repport_email" => "string|nullable",
                "host" => "string|nullable",
                "port" => "numeric|nullable",
                "alertUsername" => "string|nullable",
                "alertPassword" => "string|nullable",
                //business
                "businessName"=> "required|string",
                "businessIce" => "string|nullable",
                "businessAdresse"=> "string|nullable",
                "businessEmail"=> "email|nullable",
                "businessPhone"=> "string|nullable",
                "currency"=> "string|nullable",
                "picture"=> "image|nullable",
                //pos part
                "tva" => "required|numeric",
                "productPerPage" => "required|numeric",
                //user Part
                "userCIN" => "required",
                "userName" => "required",
                "usernameAccount" => "required",
                "userEmail" => "required|email",
                "userPhone" => "string|nullable",
                "userPassword" => "required",
            ]);
            // Create database if it doesn’t exist
            $database = env('DB_DATABASE');
            $config = config('database.connections.mysql');
            $pdo = new PDO("mysql:host={$config['host']}", $config['username'], $config['password']);
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `$database` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");

            // Run migrations & seeders
            Artisan::call('migrate', ['--force' => true]);
            Artisan::call('db:seed', ['--force' => true]);

            /**
             * update settings
             */
            
            $path = resource_path('js/settings.json');
            if (File::exists($path)) {
                //get data content
                $content = File::get($path);
                $data = json_decode($content, true);
                //convert repport_emails
                if (!empty($validateFields["repport_email"])) {
                    $emails = explode(";", $validateFields["repport_email"]);
                    $pattern = "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/";
                    $validateFields["repport_email"] = preg_grep($pattern, $emails);
                }
                //Alert sessing
                $data["alertSettings"]["stock_alert"] = (int)$validateFields["stock_alert"];
                $data["alertSettings"]["stock_expiration"] = (int)$validateFields["stock_expiration"];
                $data["alertSettings"]["repport_email"] = (array)$validateFields["repport_email"];
                $data["alertSettings"]["host"] = $validateFields["host"];
                $data["alertSettings"]["port"] = (int)$validateFields["port"];
                $data["alertSettings"]["username"] = $validateFields["alertUsername"];
                $data["alertSettings"]["password"] = $validateFields["alertPassword"];
                //businessInfo
                $logo = $data["businessInfo"]["logo"];
                if (isset($validateFields["picture"]) && !empty($validateFields["picture"])) {
                    Storage::delete("images/" . $data["businessInfo"]["logo"]);
                    $logo = time() . '.' . $validateFields["picture"]->extension();
                    $validateFields["picture"]->storeAs("images", $logo);
                }
                $data["businessInfo"]["name"] = $validateFields["businessName"];
                $data["businessInfo"]["adresse"] = $validateFields["businessAdresse"];
                $data["businessInfo"]["ice"] = $validateFields["businessIce"];
                $data["businessInfo"]["phone"] = $validateFields["businessPhone"];
                $data["businessInfo"]["email"] = $validateFields["businessEmail"];
                $data["businessInfo"]["logo"] = $logo;
                $currency = [];
                foreach($data["currencies"] as $item){
                    if($item["name"] == $validateFields["currency"]){
                        $currency = $item;
                    }
                }
                $data["businessInfo"]["currency"] = $currency;

                //pos settings
                $data["posSettings"]["tva"] = (float)$validateFields["tva"];
                $data["posSettings"]["productPerPage"] = (int)$validateFields["productPerPage"];
                //create default sector
                $sector = Sector::create([
                    "title" => "default",
                    "adresse" => ""
                ]);
                //create default customer
                $customer = Customer::create([
                    "name"=>"Default",
                    "adresse"=>"default",
                    "sector_id"=>$sector->id,
                ]);
                //user info
                //create user
                $user = User::create([
                    'name'=>$validateFields["userName"],
                    'cin'=>$validateFields["userCIN"],
                    'phone'=>$validateFields["userPhone"],
                    "username"=>$validateFields["usernameAccount"],
                    'email'=>$validateFields["userEmail"],
                    'password'=>Hash::make($validateFields["userPassword"])
                ]);
                $user->sectors()->attach([$sector->id]);
                $user->roles()->attach([1]);
                //change the status of the installed
                $data["installed"] = true;
                //update data
                $updatedContents = json_encode($data, JSON_PRETTY_PRINT);
                //update file content
                File::put($path, $updatedContents);
                //prepare data to return
            } else {
                throw new Exception("file not found");
            }
            return response(["message" => "Installation completed successfully."], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function checkInstall()
    {
        try {
            $path = resource_path('js/settings.json');

            if (!File::exists($path)) {
                // File missing → app not installed
                return response([
                    "message" => "Settings file not found.",
                    "data" => ["installed" => false]
                ], Response::HTTP_OK);
            }

            // Read and decode JSON
            $settings = json_decode(File::get($path), true);

            // Safely get the installed value (default = false)
            $installed = $settings['installed'] ?? false;

            return response([
                "message" => "Installation status retrieved successfully.",
                "data" => ["installed" => (bool) $installed]
            ], Response::HTTP_OK);

        } catch (Exception $e) {
            return response([
                "message" => $e->getMessage(),
                "data" => ["installed" => false]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}

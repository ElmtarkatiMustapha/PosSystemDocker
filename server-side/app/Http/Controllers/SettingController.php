<?php

namespace App\Http\Controllers;

use App\Models\Printer;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use PhpParser\JsonDecoder;
use Symfony\Component\HttpFoundation\Response;

class SettingController extends Controller
{
    //get business infos
    /**
     * @todo load settings json file from resource
     * @todo decode it
     * @todo get the cirrencies and business infos
     * @todo return data 
     */
    public function getBusiness(){
        try{
            //load settings file
            $path = resource_path('js/settings.json');
            $dataToReturn = null;
            if(File::exists($path)){
                $content = File::get($path);
                $data = json_decode($content,true);
                $dataToReturn["businessInfo"] = $data["businessInfo"];
                $dataToReturn["currencies"] = $data["currencies"];
            } else {
                throw new Exception("file not found");
            }
            return response(["message" => "success", "data" => $dataToReturn ], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);

        }
    }
    /**
     * update business info
     * 
     */
    public function updateBusiness(Request $request){
        try{
            $validateFields = $request->validate([
                "name"=> "required|string",
                "adresse"=> "string|nullable",
                "phone"=> "string|nullable",
                "ice" => "string|nullable",
                "email"=> "email|nullable",
                "picture"=> "image|nullable",
                "currency"=> "string|nullable"
            ]);
            $path = resource_path('js/settings.json');
            if (File::exists($path)) {
                //get data content
                $content = File::get($path);
                $data = json_decode($content, true);
                //update data
                $logo = $data["businessInfo"]["logo"];
                if (isset($validateFields["picture"]) && !empty($validateFields["picture"])) {
                    Storage::delete("images/" . $data["businessInfo"]["logo"]);
                    $logo = time() . '.' . $validateFields["picture"]->extension();
                    $validateFields["picture"]->storeAs("images", $logo);
                }
                $data["businessInfo"]["name"] = $validateFields["name"];
                $data["businessInfo"]["adresse"] = $validateFields["adresse"];
                $data["businessInfo"]["ice"] = $validateFields["ice"];
                $data["businessInfo"]["phone"] = $validateFields["phone"];
                $data["businessInfo"]["email"] = $validateFields["email"];
                $data["businessInfo"]["logo"] = $logo;
                $currency = [];
                foreach($data["currencies"] as $item){
                    if($item["name"] == $validateFields["currency"]){
                        $currency = $item;
                    }
                }
                $data["businessInfo"]["currency"] = $currency;
                $updatedContents = json_encode($data,JSON_PRETTY_PRINT);
                //update file content
                File::put($path,$updatedContents);
                //prepare data to return
            } else {
                throw new Exception("file not found");
            }
            //get all printers
            $printers = Printer::all();
            $data["printers"] = $printers;
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get alert setting 
     */
    public function getAlert(){
        try{
            $path = resource_path('js/settings.json');
            if (File::exists($path)) {
                $content = File::get($path);
                $data = json_decode($content, true);
                return response(["message" => "success", "data" => $data["alertSettings"]], Response::HTTP_OK);
            } else {
                throw new Exception("file not found");
            }
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @desc update alert setting
     * @todo validate data
     * @todo convert repport-email to a table of emails if not empty
     * @todo get old setting from settings.json file
     * @todo update alert setting section 
     * @todo update settings.json file 
     */
    public function updateAlert(Request $request)
    {
        try {
            //code...
            $validateFields = $request->validate([
                "stock_alert" => "required|numeric",
                "stock_expiration" => "required|numeric",
                "repport_email" => "string|nullable",
                "host" => "string|nullable",
                "port" => "numeric|nullable",
                "username" => "string|nullable",
                "password" => "string|nullable"
            ]);
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
                //update data
                $data["alertSettings"]["stock_alert"] = (int)$validateFields["stock_alert"];
                $data["alertSettings"]["stock_expiration"] = (int)$validateFields["stock_expiration"];
                $data["alertSettings"]["repport_email"] = (array)$validateFields["repport_email"];
                $data["alertSettings"]["host"] = $validateFields["host"];
                $data["alertSettings"]["port"] = (int)$validateFields["port"];
                $data["alertSettings"]["username"] = $validateFields["username"];
                $data["alertSettings"]["password"] = $validateFields["password"];
                //update data
                $updatedContents = json_encode($data, JSON_PRETTY_PRINT);
                //update file content
                File::put($path, $updatedContents);
                //prepare data to return
            } else {
                throw new Exception("file not found");
            }
            //get all printers
            $printers = Printer::all();
            $data["printers"] = $printers;
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            //throw $th;
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get pos setting
     */
    public function getPos()
    {
        try {
            $path = resource_path('js/settings.json');
            if (File::exists($path)) {
                $content = File::get($path);
                $data = json_decode($content, true);
                return response(["message" => "success", "data" => $data["posSettings"]], Response::HTTP_OK);
            } else {
                throw new Exception("file not found");
            }
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * update Pos Settings
     */
    public function updatePos(Request $request)
    {
        try {
            $validateFields = $request->validate([
                "tva" => "required|numeric",
                "discount" => "required|boolean",
                "productPerPage" => "required|numeric"
            ]);
            $path = resource_path('js/settings.json');
            if (File::exists($path)) {
                //get data content
                $content = File::get($path);
                $data = json_decode($content, true);

                //update data
                $data["posSettings"]["tva"] = (float)$validateFields["tva"];
                $data["posSettings"]["productPerPage"] = (int)$validateFields["productPerPage"];
                $data["posSettings"]["discount"] = (bool)$validateFields["discount"];
                //update data
                $updatedContents = json_encode($data, JSON_PRETTY_PRINT);
                //update file content
                File::put($path, $updatedContents);
                //prepare data to return
            } else {
                throw new Exception("file not found");
            }
            //get all printers
            $printers = Printer::all();
            $data["printers"] = $printers;
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get printer by id
     */
    public function getPrinter(Request $request)
    {
        try {
            //get the id 
            $id = $request->route("id");
            $data = Printer::find($id);
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * add printer
     * @todo add new printer and return all printer plus settings 
     */
    public function addPrinter(Request $request)
    {
        try {
            $validateFields = $request->validate([
                "name" => "required|string",
                "description" => "string|nullable",
                "ipAdresse" => "string|nullable",
                "profile" => "string|nullable",
                "port" => "numeric|nullable",
                "active" => "boolean",
                "network" => "boolean"
            ]);
            Printer::create([
                "name" => $validateFields["name"],
                "description" => $validateFields["description"],
                "ipAdresse" => $validateFields["ipAdresse"],
                "profile" => $validateFields["profile"],
                "port" => $validateFields["port"],
                "active" => $validateFields["active"],
                "network" => $validateFields["network"]
            ]);
            $printers = Printer::all();
            return response(["message" => "success", "data" => $printers], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * remove printer 
     */
    public function removePrinter(Request $request)
    {
        try {
            $id = $request->route("id");
            Printer::destroy($id);
            $path = resource_path('js/settings.json');
            $data = null;
            if (File::exists($path)) {
                $content = File::get($path);
                $data = json_decode($content, true);
            } else {
                throw new Exception("file not found");
            }
            $printers = Printer::all();
            $data["printers"] = $printers;
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * update printer 
     */
    public function updatePrinter(Request $request)
    {
        try {
            //validate data
            $validateFields = $request->validate([
                "name" => "required|string",
                "description" => "string|nullable",
                "ipAdresse" => "string|nullable",
                "profile" => "string|nullable",
                "port" => "numeric|nullable",
                "active" => "boolean",
                "network" => "boolean"
            ]);
            //get the id
            $id = $request->route("id");
            $printer = Printer::find($id);
            $printer->update([
                "name" => $validateFields["name"],
                "description" => $validateFields["description"],
                "ipAdresse" => $validateFields["ipAdresse"],
                "profile" => $validateFields["profile"],
                "port" => $validateFields["port"],
                "active" => $validateFields["active"],
                "network" => $validateFields["network"]
            ]);
            $printers = Printer::all();
            return response(["message" => "success", "data" => $printers], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    //settings
    public function getAll(){
        try{
            $path = resource_path('js/settings.json');
            $data = null;
            if (File::exists($path)) {
                $content = File::get($path);
                $data = json_decode($content, true);
            }else {
                throw new Exception("file not found");
            }
            $printers = Printer::all();
            $data["printers"] = $printers;
            return response(["message" => "success", "data" => $data], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * get all printers 
     */
    public function getAllPrinters()
    {
        try {
            //get all
            $printers = Printer::where("active", "=", 1)->get();
            return response(["message" => "success", "data" => $printers], Response::HTTP_OK);
        }catch(Exception $err){
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}

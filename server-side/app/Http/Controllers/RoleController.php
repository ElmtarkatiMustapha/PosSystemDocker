<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Exception;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response ;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

class RoleController extends Controller
{
    /**
     * @param Request
     * @return response
     */
   public function create(Request $request){
    try{
        //validate fields
        $validateFields = $request->validate([
            "title"=>"required|string"
        ]);
        //create role
        $role = Role::create($validateFields);
        return response(["message"=>$role],Response::HTTP_OK);
    }catch(Exception $err){
        return response(["message"=>$err->getMessage()],Response::HTTP_BAD_REQUEST);
    }
   }

   public function update(Request $request){
    try{
        //validate fields
        $validateFields = $request->validate([
            "role_id"=>"required",
            "title"=>"required|string"
        ]);
        //get the role
        $role = Role::find($validateFields["role_id"]);
        $role->title = $validateFields["title"];
        $role->save();
        return response(["message"=>"success"],Response::HTTP_OK);
    }catch(Exception $err){
        return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
    }
   }
    public function getAll()
    {
        try {
            $roles = Role::all();
            return response(["message" => "success", "data" => $roles], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }

}

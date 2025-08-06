<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class ExpenseController extends Controller
{
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     * @todo validate data
     * @todo create spent
     */
    public function create(Request $request)
    {
        try {
            //validate data
            $validateFields = $request->validate([
                "title" => "required|string",
                "description" => "string|nullable",
                "amount" => "required|numeric"
            ]);
            //get user
            $user = Auth::user();
            $spent = Expense::create([
                "title" => $validateFields["title"],
                "description" => $validateFields["description"],
                "amount" => $validateFields["amount"],
                "user_id" => $user->id,
            ]);
            $spent->user = $user->name;
            return response(["message" => "success", "data" => $spent], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }

    }

    /**
     * @desc get all spent filtered by (data)
     * @todo validate data 
     * @todo pepare request
     * @todo get spents 
     * @todo return response 
     */
    public function getAll(Request $request)
    {
        try {
            $validateFields = $request->validate([
                "filter" => "required|string",
                "startDate" => "",
                "endDate" => ""
            ]);
            $filterData = $this->filterData($validateFields, "expenses.created_at");
            $spents = Expense::join("users", "users.id", "=", "expenses.user_id")
            ->whereBetween("expenses.created_at", $filterData["filter"])
            ->select(
                DB::raw("expenses.id as id"),
                DB::raw("expenses.title as title"),
                DB::raw("expenses.amount as amount"),
                DB::raw("expenses.description as description"),
                DB::raw("expenses.created_at as created_at"),
                DB::raw("users.name as user"),
            )
                ->get();
            $statistics = Expense::whereBetween("expenses.created_at", $filterData["filter"])
            ->select(
                DB::raw("COUNT(expenses.id) as spents_count"),
                DB::raw("SUM(expenses.amount) as total"),
            )
                ->get();
            if (empty($statistics[0]->spents_count)) {
                $statistics[0] = collect(["spents_count" => 0, "total" => 0]);
            }
            return response(["message" => "success", "data" => collect(["spents" => $spents, "statistics" => $statistics[0]])], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @desc delete one
     * @todo get the id from route
     */
    public function delete(Request $request)
    {
        try {
            $id = $request->route("id");
            Expense::find($id)->delete();
            return response(["message" => "Deleted with success"], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @desc get one spent
     */
    public function getOne(Request $request)
    {
        try {
            $id = $request->route("id");
            $spent = Expense::find($id);
            return response(["message" => "Success", "data" => $spent], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
    /**
     * @desc update spent
     */
    public function update(Request $request)
    {
        try {
            $id = $request->route("id");
            $validateFields = $request->validate([
                "title" => "required|string",
                "description" => "string|nullable",
                "amount" => "required|numeric"
            ]);
            $spent = Expense::find($id);
            $spent->update([
                "title" => $validateFields["title"],
                "description" => $validateFields["description"],
                "amount" => $validateFields["amount"]
            ]);
            $collect = collect($spent->toArray());
            $collect->put("user", $spent->user->name);
            return response(["message" => "Success", "data" => $collect], Response::HTTP_OK);
        } catch (Exception $err) {
            return response(["message" => $err->getMessage()], Response::HTTP_BAD_REQUEST);
        }
    }
}

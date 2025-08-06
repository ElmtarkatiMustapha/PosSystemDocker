<?php

namespace App\Http\Controllers;

use App\Models\Details_return;
use App\Models\Returns;
use Exception;
use Illuminate\Http\Request;

class DetailsReturnController extends Controller
{
    public function addLine(Returns $return, $line)
    {
        try {
            Details_return::create([
                "price" => $line["unitPrice"],
                "qnt" => $line["return_qnt"],
                "margin" => $line["cachierMargin"],
                "discount" => $line["discount"],
                "return_id" => $return->id,
                "product_id" => $line["product_id"]
            ]);
            return true;
        } catch (Exception $err) {
            throw new Exception($err->getMessage());
            return false;
        }
    }
}

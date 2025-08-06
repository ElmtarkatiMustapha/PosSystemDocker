<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Details_order extends Model
{
    use HasFactory;
    protected $fillable = [ 
        "price",
        "qnt",
        "margin",
        "discount",
        "status",
        "order_id",
        "product_id"
    ];
    public function order(){
        return $this->belongsTo(Order::class);
    }
    public function product(){
        return $this->belongsTo(Product::class);
    }
    /**
     * changing the beheviour of date returned by laravel get method 
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;
    protected $fillable = [
        'stock_actuel',
        'stock_init',
        'price',
        'expired_at',
        "purchase_id",
        "product_id",
    ];
    public function product(){
        return $this->belongsTo(Product::class);
    }
    public function purchase(){
        return $this->belongsTo(Purchase::class);
    }
}

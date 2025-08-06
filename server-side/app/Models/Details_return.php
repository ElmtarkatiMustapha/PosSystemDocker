<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Details_return extends Model
{
    use HasFactory;
    protected $fillable = [
        "price",
        "qnt",
        "margin",
        "discount",
        "return_id",
        "product_id"
    ];
    public function returns(){
        return $this->belongsTo(Returns::class, "id", "return_id");
    }
    public function product(){
        return $this->BelongsTo(Product::class);
    }
    /**
     * changing the beheviour of date returned by laravel get method 
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i');
    }
}

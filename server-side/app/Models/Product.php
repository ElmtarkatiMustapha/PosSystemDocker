<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $fillable = [
        "barcode",
        "name",
        // "tva",
        "wholesales_price",
        "retail_price",
        "discount",
        "cachier_margin",
        "picture",
        "expires",
        "category_id",
        "active",
        "enable_stock"
    ];

    public function category(){
        return $this->belongsTo(Category::class);
    }
    public function details_order(){
        return $this->hasMany(Details_order::class);
    }
    public function details_return(){
        return $this->hasMany(Details_return::class);
    }
    public function stocks(){
        return $this->hasMany(Stock::class)->orderBy("stock_actuel", "desc");
    }
    public function orders()
    {
        $orders = [];
        foreach ($this->details_order as $item) {
            $orders[] = $item->order;
        }
        return array_unique($orders);
    }
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i');
    }
}

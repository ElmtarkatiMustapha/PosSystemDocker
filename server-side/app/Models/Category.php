<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "description",
        "active",
        "picture"
    ];

    public function products(){
        return $this->hasMany(Product::class);
    }
    public function orders()
    {
        $orders = [];
        foreach ($this->products as $item) {
            $orders[] = $item->orders();
        }
        return array_unique(array_merge(...$orders));
    }
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i');
    }
}

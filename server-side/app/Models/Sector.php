<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    use HasFactory;

    protected $fillable = [
        "title",
        "adresse",
        "active"
    ];

    public function customers(){
        return $this->hasMany(Customer::class);
    }

    public function users(){
        return $this->belongsToMany(User::class);
    }
    public function orders()
    {
        $orders = [];
        foreach ($this->customers as $item) {
            $orders[] = array(...$item->orders);
        }
        return array_merge(...$orders);
    }

}

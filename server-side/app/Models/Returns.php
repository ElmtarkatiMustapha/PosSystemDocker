<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Returns extends Model
{
    use HasFactory;
    protected $fillable = [
        "order_id",
        "user_id",
    ];
    public function order(){
        return $this->belongsTo(Order::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function details_returns()
    {
        return $this->hasMany(Details_return::class, "return_id");
    }

    /**
     * changing the beheviour of date returned by laravel get method 
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i');
    }
}

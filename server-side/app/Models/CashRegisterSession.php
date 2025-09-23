<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CashRegisterSession extends Model
{
    use HasFactory;
    protected $fillable = [
        "opened_at",
        "closed_at",
        "opening_amount",
        "closing_amount",
        "note",
        "user_id",
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function orders(){
        return $this->hasMany(Order::class,"cashRegisterSession_id");
    }
    /**
     * get the total of the this cash register
     */
    public function total(){
        $total = 0;
        foreach($this->orders as $item){
            $total +=$item->totalTTC();
        }
        return $total;
    }
    /**
     * changing the beheviour of date returned by laravel get method 
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $fillable = [
        "type",
        "payed_margin",
        "amountProvided",
        "tax",
        "status",
        "delivered_by",
        "customer_id",
        "delivered_at",
        "user_id",
        "cashRegisterSession_id",
    ];
    public function customer(){
        return $this->belongsTo(Customer::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function cashRegisterSession(){
        return $this->belongsTo(CashRegisterSession::class,"id","cashRegisterSession_id");
    }
    public function details_order(){
        return $this->hasMany(Details_order::class);
    }
    public function returns(){
        return $this->hasMany(Returns::class);
    }
    // calcilate total HT
    public function totalOrder()
    {
        $total = 0;
        for ($i = 0; $i < count($this->details_order); $i++) {
            $price = $this->details_order[$i]->price * $this->details_order[$i]->qnt;
            $total +=  $price - ($price * $this->details_order[$i]->discount / 100);
        }
        return $total;
    }
    public function totalHT()
    {
        $total = 0;
        for ($i = 0; $i < count($this->details_order); $i++) {
            $price = $this->details_order[$i]->price * $this->details_order[$i]->qnt;
            $total +=  $price - ($price * $this->details_order[$i]->discount / 100);
        }
        return $total;
    }
    // calcilate total TAX
    public function totalHTD()
    {
        $total = 0;
        for ($i = 0; $i < count($this->details_order); $i++) {
            $price = $this->details_order[$i]->price * $this->details_order[$i]->qnt;
            $total +=  $price;
        }
        return $total;
    }
    // calcilate total TAX
    public function totalTax()
    {
        $total = 0;
        for ($i = 0; $i < count($this->details_order); $i++) {
            $price = $this->details_order[$i]->price * $this->details_order[$i]->qnt;
            $total +=  $price - ($price * $this->details_order[$i]->discount / 100);
        }
        return $total * $this->tax / 100;
    }
    // calcilate total Discount
    public function totalDiscount()
    {
        $total = 0;
        for ($i = 0; $i < count($this->details_order); $i++) {
            $price = $this->details_order[$i]->price * $this->details_order[$i]->qnt;
            $total +=  ($price * $this->details_order[$i]->discount / 100);
        }
        return $total;
    }
    // calculate total TTC
    public function totalTTC()
    {
        $total = 0;
        for ($i = 0; $i < count($this->details_order); $i++) {
            $price = $this->details_order[$i]->price * $this->details_order[$i]->qnt;
            $total +=  $price - ($price * $this->details_order[$i]->discount / 100);
        }
        return $total + $total * $this->tax / 100;
    }
    
    public function numberItems()
    {
        $qnt = 0;
        for ($i = 0; $i < count($this->details_order); $i++) {
            $qnt +=  $this->details_order[$i]->qnt;
        }
        return $qnt;
    }
    /**
     * changing the beheviour of date returned by laravel get method 
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i');
    }
}

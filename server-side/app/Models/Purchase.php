<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Purchase extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "supplier_id"
    ];
    public function supplier(){
        return $this->belongsTo(Supplier::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }
    public function totalPurchase()
    {
        $total = 0;
        for ($i = 0; $i < count($this->stocks); $i++) {
            $total += $this->stocks[$i]->price * $this->stocks[$i]->stock_init;
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

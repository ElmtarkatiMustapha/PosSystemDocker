<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;
    protected $fillable = [
        "title",
        "description",
        "amount",
        "user_id",
    ];
    public function user(){
        return $this->belongsTo(User::class);
    }
    /**
     * changing the beheviour of date returned by laravel get method 
     */
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i');
    }
}

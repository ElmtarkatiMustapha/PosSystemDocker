<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = [
        "name",
        "adresse",
        "email",
        "ice",
        "phone",
        "active",
        "sector_id",
        "picture"
    ];

    public function sector(){
        return $this->belongsTo(Sector::class);
    }
    public function orders(){
        return $this->hasMany(Order::class);
    }
}

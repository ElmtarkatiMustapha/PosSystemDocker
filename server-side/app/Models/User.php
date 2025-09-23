<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'cin',
        'phone',
        "username",
        'picture',
        'email',
        'password',
        'active',
        'cashier',
        'printer_id'
    ];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];
    

    public function expenses(){
        return $this->hasMany(Expense::class);
    }
    public function orders(){
        return $this->hasMany(Order::class);
    }
    public function purchases(){
        return $this->hasMany(Purchase::class);
    }
    public function cashRegisterSessions(){
        return $this->hasMany(CashRegisterSession::class);
    }
    public function sectors(){
        return $this->belongsToMany(Sector::class);
    }
    public function roles(){
        return $this->belongsToMany(Role::class);
    }
    public function printer()
    {
        return $this->belongsTo(Printer::class);
    }
    public function customers(){
        $customers = [];
        foreach($this->sectors as $sector){
            $customers[] = $sector->customers->toArray();
        } 
        
        return array_merge(...$customers);
    }
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('d-m-Y H:i');
    }

}

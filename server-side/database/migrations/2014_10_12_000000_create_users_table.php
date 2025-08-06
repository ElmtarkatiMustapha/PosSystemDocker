<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('cin');
            $table->string('phone')->nullable();
            $table->string('picture')->nullable();
            $table->string('email')->unique();
            $table->string('username')->unique();
            $table->string('password');
            $table->boolean("active")->default(1);
            $table->boolean("cashier")->default(1);
            $table->bigInteger("printer_id")->nullable(); 
            $table->timestamps();
        });
        DB::table('users')->insert([
            [
                "id" => 1,
                "name" => "mustapha",
                "cin" => "Z649630",
                "email" => "mstafamt8@gmail.com",
                "username" => "admin",
                "password" =>  Hash::make("admin"),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}

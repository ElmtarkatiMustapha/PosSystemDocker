<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string("title");
            $table->timestamps();
        });
        DB::table('roles')->insert([
            ["id"=>1,"title"=>"admin"],
            ["id"=>2,"title"=> "cachier"],
            ["id"=>3,"title"=> "delivery"],
            ["id"=>4,"title"=> "manager"]
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('roles');
    }
}

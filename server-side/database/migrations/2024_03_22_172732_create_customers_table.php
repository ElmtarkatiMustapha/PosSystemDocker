<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("adresse");
            $table->string("ice")->nullable();
            $table->string("phone")->nullable();
            $table->string("picture")->nullable();
            $table->boolean("active")->default(1);
            $table->bigInteger("sector_id")->nullable();
            $table->timestamps();
        });
        DB::table('customers')->insert([
            [
                "id" => 1,
                "name"=> "default",
                "adresse"=>"default",
                "sector_id"=>0
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
        Schema::dropIfExists('customers');
    }
}

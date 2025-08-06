<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDetailsReturnsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('details_returns', function (Blueprint $table) {
            $table->id();
            $table->float("price");
            $table->integer("qnt");
            $table->float("margin");
            $table->float("discount");
            $table->bigInteger("product_id");
            $table->bigInteger("return_id");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('details_returns');
    }
}

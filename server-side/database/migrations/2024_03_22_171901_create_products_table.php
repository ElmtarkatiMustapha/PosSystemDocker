<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('barcode')->unique();
            $table->string('name');
            $table->float("tva")->default(0);
            $table->float("wholesales_price");
            $table->float("retail_price");
            $table->float("discount")->default(0);
            $table->boolean("expires")->default(0);
            $table->float("cachier_margin")->default(0);
            $table->string('picture')->nullable();
            $table->bigInteger("category_id");
            $table->boolean("active")->default(1);
            $table->boolean("enable_stock");
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
        Schema::dropIfExists('products');
    }
}

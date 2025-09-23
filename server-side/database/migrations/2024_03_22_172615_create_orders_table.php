<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string("type");
            $table->boolean("payed_margin")->default(false);
            $table->float("amountProvided")->default(0);
            $table->string("status")->default("pending");
            $table->float("tax")->default(0);
            $table->bigInteger("delivered_by")->default(0);
            $table->bigInteger("customer_id");
            $table->bigInteger("user_id");
            $table->bigInteger("cashRegisterSession_id")->nullable();
            $table->timestamp("delivered_at")->useCurrent();
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
        Schema::dropIfExists('orders');
    }
}

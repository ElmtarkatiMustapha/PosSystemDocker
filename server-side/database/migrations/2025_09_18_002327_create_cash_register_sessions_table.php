<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCashRegisterSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cash_register_sessions', function (Blueprint $table) {
            $table->id();
            $table->timestamp("opened_at")->nullable();
            $table->timestamp("closed_at")->nullable();
            $table->decimal("opening_amount")->nullable();
            $table->decimal("closing_amount")->nullable();
            $table->string("note")->nullable();
            $table->bigInteger("user_id");
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
        Schema::dropIfExists('cash_register_sessions');
    }
}

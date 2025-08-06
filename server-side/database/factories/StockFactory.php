<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class StockFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'stock_actuel'=>100,
            'stock_init'=>100,
            'price'=>15,
            'purchase_id'=>1
        ];
    }
}

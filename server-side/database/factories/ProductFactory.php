<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "barcode"=>$this->faker->unique()->ean8(),
            "name"=>$this->faker->name(),
            "tva"=>0,
            "wholesales_price"=>$this->faker->randomFloat(2,1,10000),
            "retail_price" => $this->faker->randomFloat(2, 1, 10000),
            "cachier_margin" => $this->faker->randomFloat(2, 0, 10),
            "picture"=> "product.jpg",
            "active"=>1,
            "enable_stock"=>1
        ];
    }
}

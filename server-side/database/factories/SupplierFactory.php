<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SupplierFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'ice' => $this->faker->ean8(),
            "adresse" => $this->faker->address(),
            "email" => $this->faker->email(),
            "picture" => "",
            "description" => $this->faker->text(30),
            "active" => 1
        ];
    }
}

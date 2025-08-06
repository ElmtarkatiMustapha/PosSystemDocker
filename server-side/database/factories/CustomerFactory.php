<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "name"=>$this->faker->name(),
            "adresse"=>$this->faker->address(),
            "ice"=>$this->faker->ean8(),
            "phone"=>$this->faker->phoneNumber(),
            "active"=>1,
            "picture"=>"sector.jpg"
        ];
    }
}

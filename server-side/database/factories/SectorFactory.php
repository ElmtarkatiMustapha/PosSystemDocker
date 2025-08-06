<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SectorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "title"=>$this->faker->text(10),
            "adresse"=>$this->faker->address(),
            "active"=>1
        ];
    }
}

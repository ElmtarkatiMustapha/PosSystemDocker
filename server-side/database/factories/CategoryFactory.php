<?php

namespace Database\Factories;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "name"=> $this->faker->name(),
            "description" =>$this->faker->text(60),
            "active"=> 1,
            "picture"=> "category.jpeg"
        ];
    }
}

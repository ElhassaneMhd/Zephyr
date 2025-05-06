<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Table>
 */
class TableFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "table_name" => $this->faker->randomElement(["Hotel","Appartement","Club"]),
            "name" => $this->faker->randomElement(["Jardin","1er Etage","piscine","2eme Etage" , "Heures normales" , "Heures creuses" ,"Heures pointes"]),
            "date" => $this->faker->dateTime(),
            "index" => $this->faker->randomFloat(2, 0, 9999),
            "consummation" => $this->faker->randomFloat(2, 0, 9999),
            "puissance" => $this->faker->randomFloat(0, 0, 300),
            "cos" => $this->faker->randomFloat(4, 0, 1),
            "centre_id" => $this->faker->randomElement([1,2,3,4]),
            "counter" =>$this->faker->randomElement(["general","divisional"]),
            "category" =>$this->faker->randomElement(['electricite','eau','gaz','biomasse','carburant']),
            "created_at" => now(),
            "updated_at" => now()
        ];
    }
}

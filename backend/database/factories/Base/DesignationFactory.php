<?php

namespace Database\Factories\Base;

use App\Models\Base\Designation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Base\Designation>
 */
class DesignationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Designation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $designations = [
            'Intern',
            'Junior Developer',
            'Software Developer',
            'Senior Developer',
            'Team Lead',
            'Project Manager',
            'Technical Manager',
            'Product Manager',
            'Architect',
            'Director',
            'Vice President',
            'Chief Technology Officer',
        ];

        return [
            'name' => fake()->unique()->randomElement($designations),
            'description' => fake()->sentence(10),
            'level' => fake()->numberBetween(1, 10),
        ];
    }
}

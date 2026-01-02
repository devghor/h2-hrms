<?php

namespace Database\Seeders;

use App\Models\Base\Designation;
use Illuminate\Database\Seeder;

class DesignationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $designations = [
            [
                'name' => 'Intern',
                'description' => 'Entry-level position for learning and training',
                'level' => 1,
            ],
            [
                'name' => 'Junior Developer',
                'description' => 'Junior-level software developer',
                'level' => 2,
            ],
            [
                'name' => 'Software Developer',
                'description' => 'Mid-level software developer',
                'level' => 3,
            ],
            [
                'name' => 'Senior Developer',
                'description' => 'Senior-level software developer with extensive experience',
                'level' => 4,
            ],
            [
                'name' => 'Team Lead',
                'description' => 'Leads a team of developers',
                'level' => 5,
            ],
            [
                'name' => 'Project Manager',
                'description' => 'Manages projects and coordinates with teams',
                'level' => 6,
            ],
            [
                'name' => 'Technical Manager',
                'description' => 'Manages technical aspects and team leadership',
                'level' => 7,
            ],
            [
                'name' => 'Director',
                'description' => 'Director-level position with strategic responsibilities',
                'level' => 8,
            ],
            [
                'name' => 'Vice President',
                'description' => 'Vice President with executive responsibilities',
                'level' => 9,
            ],
            [
                'name' => 'Chief Technology Officer',
                'description' => 'CTO - Top executive technology position',
                'level' => 10,
            ],
        ];

        foreach ($designations as $designation) {
            Designation::create($designation);
        }
    }
}

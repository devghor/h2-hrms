<?php

namespace Database\Seeders;

use App\Models\Uam\User;
use Database\Factories\UserFactory;
use Illuminate\Database\Seeder;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (!User::query()->where('email', 'sa@app.com')->first()) {
            UserFactory::new()->createOne([
                'name' => 'Super Admin',
                'email' => 'sa@app.com',
            ]);
        }
    }
}

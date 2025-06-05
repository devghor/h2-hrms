<?php

namespace Database\Seeders;

use App\Models\User;
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
                'email' => 'sa@app.com',
            ]);
        }
    }
}

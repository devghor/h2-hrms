<?php

namespace Database\Seeders;

use Database\Factories\UserFactory;
use Illuminate\Database\Seeder;
use Modules\User\Models\User;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (User::query()->where('email', 'sa@app.com')->doesntExist()) {
            UserFactory::new()->createOne([
                'email' => 'sa@app.com',
            ]);
        }
    }
}

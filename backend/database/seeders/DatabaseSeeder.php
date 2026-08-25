<?php

namespace Database\Seeders;

use Database\Seeders\DemoUserSeeder;
use Database\Seeders\ProductCategorySeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            DemoUserSeeder::class,
            ProductCategorySeeder::class,
        ]);
    }
}

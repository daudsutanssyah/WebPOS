<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    /**
     * Seed the demo user account for portfolio access.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'demo@webpos.com'],
            [
                'name' => 'Demo User',
                'email' => 'demo@webpos.com',
                'password' => Hash::make('demo12345'),
            ]
        );
    }
}

<?php

namespace Database\Seeders;

use App\Models\Centre;
use App\Models\Historic;
use App\Models\Table;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        Table::factory(50)->create();
        // Historic::factory(10)->create();
        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'superadmin@zephyr.com',
            "role" => 'superAdmin',
        ]);
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@zephyr.com',
            "role" => 'admin',
        ]);
        User::factory()->create([
            'name' => 'User',
            'email' => 'user@zephyr.com',
            "role" => 'user',
        ]);
        Centre::factory()->create(['name' => 'Mazagan']);
        Centre::factory()->create(['name' => 'Ifrane']);
        Centre::factory()->create(['name' => 'Agadir']);
        Centre::factory()->create(['name' => 'Targa']);
        Centre::factory()->create(['name' => 'Club Narjiss Rabat']);
    }
}

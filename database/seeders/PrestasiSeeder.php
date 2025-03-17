<?php

namespace Database\Seeders;

use App\Models\Prestasi;
use Illuminate\Database\Seeder;

class PrestasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Prestasi::factory()->count(1)->create([
            'user_id' => 1, // Gunakan user ID 1 untuk semua data
        ]);
    }
}


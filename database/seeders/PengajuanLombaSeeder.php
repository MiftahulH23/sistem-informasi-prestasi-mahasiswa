<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PengajuanLomba;

class PengajuanLombaSeeder extends Seeder
{
    public function run()
    {
        PengajuanLomba::factory(1)->create([
            'user_id' => 1, // Gunakan user ID 1 untuk semua data
        ]);
    }
}


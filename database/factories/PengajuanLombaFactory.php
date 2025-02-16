<?php

namespace Database\Factories;

use App\Models\PengajuanLomba;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PengajuanLomba>
 */
class PengajuanLombaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

     
     protected $model = PengajuanLomba::class;

     public function definition()
     {
         return [
             'user_id' => 1, // Gunakan user ID 1 untuk semua data
             'kategori_lomba_id' => \App\Models\KategoriLomba::factory(), // Jika ada relasi kategori
             'judul_lomba' => $this->faker->sentence(1),
             'jenis_lomba' => $this->faker->randomElement(['Individu', 'Kelompok']),
             'tingkat_lomba' => $this->faker->randomElement(['Lokal', 'Nasional', 'Internasional']),
             'model_pelaksanaan' => $this->faker->randomElement(['Online', 'Offline']),
             'dosen_pembimbing' => $this->faker->name(),
             'tanggal_mulai' => $this->faker->date(),
             'tanggal_selesai' => $this->faker->date(),
             'jenis_kepesertaan' => $this->faker->randomElement(['Individu', 'Kelompok']),
             'jumlah_peserta' => $this->faker->numberBetween(1, 10),
             'anggota_kelompok' => $this->faker->sentence(3), // Bisa diubah ke JSON jika perlu
             'surat_tugas' => $this->faker->randomElement(['surat1.pdf', 'surat2.pdf']), // Contoh file
             'status' => $this->faker->randomElement(['Diajukan', 'Disetujui', 'Ditolak']),
         ];
     }
}

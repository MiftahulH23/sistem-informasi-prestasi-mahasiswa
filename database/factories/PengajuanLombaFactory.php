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
        // return [
        //     'user_id' => 1, // Gunakan user ID 1 untuk semua data
        //     'kategorilomba_id' => \App\Models\KategoriLomba::factory(), // Jika ada relasi kategori
        //     'judul_lomba' => $this->faker->sentence(1),
        //     'jenis_lomba' => $this->faker->randomElement(['Akademik', 'Non-Akademik']),
        //     'tingkat_lomba' => $this->faker->randomElement(['Lokal', 'Nasional', 'Internasional']),
        //     'model_pelaksanaan' => $this->faker->randomElement(['Online', 'Offline']),
        //     'dosen_pembimbing' => $this->faker->name(),
        //     'program_studi' => $this->faker->randomElement(['Sistem Informasi', 'Teknik Informatika', 'Teknik Elektro']),
        //     'tanggal_mulai' => $this->faker->dateTimeBetween('2025-01-01', '2025-12-31')->format('Y-m-d'),
        //     'tanggal_selesai' => $this->faker->dateTimeBetween('2025-01-01', '2025-12-31')->format('Y-m-d'),
        //     'jenis_kepesertaan' => $this->faker->randomElement(['Individu', 'Kelompok']),
        //     'jumlah_peserta' => $this->faker->numberBetween(1, 10),
        //     'anggota_kelompok' => $this->faker->sentence(3), // Bisa diubah ke JSON jika perlu
        //     'surat_tugas' => $this->faker->randomElement(['surat1.pdf', 'surat2.pdf']), // Contoh file
        //     'status' => $this->faker->randomElement(['Diajukan', 'Diterima', 'Ditolak']),
        // ];
// Umum : 229ed366-5386-4798-a095-12c2cc36bf6f
// Kemendikbud : 067ed062-6533-4ed1-873f-181888fd887c
// Bakorma : a2d71bb7-f041-43a2-981b-20865956fe57
// Kategori A : c5cc8a77-41b6-4434-8376-b59221ba4efb

        return [
            'user_id' => 1, // Tetap 1 untuk semua data
            'kategorilomba_id' => 'c5cc8a77-41b6-4434-8376-b59221ba4efb',
            'judul_lomba' => 'Lomba Kategori A', // Judul tetap
            'jenis_lomba' => 'Non-Akademik', // Tetap Non-Akademik
            'tingkat_lomba' => 'Provinsi', 
            'model_pelaksanaan' => 'Online',
            'dosen_pembimbing' => 'Dr. Ahmad Sudrajat', // Nama dosen tetap
            'program_studi' => 'Teknologi Rekayasa Mekatronika', 
            'tanggal_mulai' => '2025-04-01', // Tanggal tetap
            'tanggal_selesai' => '2025-04-05', // Tanggal tetap
            'jenis_kepesertaan' => 'Individu', // Tetap Individu
            'jumlah_peserta' => 1, // Tetap 1
            'anggota_kelompok' => 'Miftahul Huda', // Kosong karena individu
            'surat_tugas' => 'surat_tugas.pdf', // Nama file tetap
            'status' => 'Diterima', // Tetap Diajukan
        ];
    }
}

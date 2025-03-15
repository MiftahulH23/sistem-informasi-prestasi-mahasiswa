<?php
namespace Database\Factories;

use App\Models\Prestasi;
use App\Models\PengajuanLomba;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PrestasiFactory extends Factory
{
    protected $model = Prestasi::class;

    public function definition()
    {
        return [
            'prestasi_id' => (string) Str::uuid(),
            'pengajuanlomba_id' => PengajuanLomba::factory(), // Buat otomatis jika belum ada
            'user_id' => User::factory(), // Buat otomatis jika belum ada
            'capaian_prestasi' => $this->faker->randomElement(['Juara 1', 'Juara 2', 'Juara 3', 'Finalis']),
            'sertifikat' => $this->faker->boolean ? 'sertifikat.pdf' : null, // Random ada/tidak
            'dokumentasi' => [
                $this->faker->imageUrl(640, 480, 'achievement'),
                $this->faker->imageUrl(640, 480, 'award'),
            ], // Simpan sebagai array agar bisa dikonversi ke JSON otomatis
            'surat_tugas' => $this->faker->boolean ? 'surat_tugas.pdf' : null, // Random ada/tidak
            'url_media_sosial' => $this->faker->url,
            'status' => $this->faker->randomElement(['Diajukan', 'Diterima', 'Ditolak']),
        ];
    }
}

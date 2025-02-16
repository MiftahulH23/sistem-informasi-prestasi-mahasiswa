<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\KategoriLomba;

class KategoriLombaFactory extends Factory
{
    protected $model = KategoriLomba::class;

    public function definition()
    {
        return [
            'kategori_lomba' => $this->faker->word(),
        ];
    }
}

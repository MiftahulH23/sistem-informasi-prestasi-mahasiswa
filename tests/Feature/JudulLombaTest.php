<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\JudulLomba;
use App\Models\KategoriLomba;
use Illuminate\Foundation\Testing\RefreshDatabase;

class JudulLombaTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_judul_lomba()
    {
        $kategori = KategoriLomba::create(['kategori_lomba' => 'Teknologi']);
        JudulLomba::create([
            'judul_lomba' => 'Lomba Aplikasi',
            'kategorilomba_id' => $kategori->kategorilomba_id
        ]);

        $response = $this->get('/judul-lomba');
        $response->assertStatus(200);
        $response->assertSee('Lomba Aplikasi');
    }

    /** @test */
    public function it_can_create_judul_lomba()
    {
        $kategori = KategoriLomba::create(['kategori_lomba' => 'Inovasi']);
        $response = $this->post('/judul-lomba/store', [
            'judul_lomba' => 'Lomba Robot',
            'kategorilomba_id' => $kategori->kategorilomba_id,
        ]);

        $response->assertRedirect('/judul-lomba');
        $this->assertDatabaseHas('judul_lomba', ['judul_lomba' => 'Lomba Robot']);
    }

    /** @test */
    public function it_can_update_judul_lomba()
    {
        $kategori1 = KategoriLomba::create(['kategori_lomba' => 'A']);
        $kategori2 = KategoriLomba::create(['kategori_lomba' => 'B']);

        $judul = JudulLomba::create([
            'judul_lomba' => 'Lomba Lama',
            'kategorilomba_id' => $kategori1->kategorilomba_id,
        ]);

        $response = $this->put("/judul-lomba/{$judul->judullomba_id}", [
            'judul_lomba' => 'Lomba Baru',
            'kategorilomba_id' => $kategori2->kategorilomba_id,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('judul_lomba', ['judul_lomba' => 'Lomba Baru']);
    }

    /** @test */
    public function it_can_delete_judul_lomba()
    {
        $kategori = KategoriLomba::create(['kategori_lomba' => 'C']);
        $judul = JudulLomba::create([
            'judul_lomba' => 'Lomba Dihapus',
            'kategorilomba_id' => $kategori->kategorilomba_id,
        ]);

        $response = $this->delete("/judul-lomba/{$judul->judullomba_id}");
        $response->assertRedirect();

        $this->assertDatabaseMissing('judul_lomba', ['judul_lomba' => 'Lomba Dihapus']);
    }
}

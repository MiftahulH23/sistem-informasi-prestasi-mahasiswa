<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\KategoriLomba;
use Illuminate\Foundation\Testing\RefreshDatabase;

class KategoriLombaTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_can_list_kategori_lomba()
    {
        KategoriLomba::factory()->create(['kategori_lomba' => 'Seni']);
        $response = $this->get('/kategori-lomba');

        $response->assertStatus(200);
        $response->assertSee('Seni');
    }

    /** @test */
    public function it_can_create_kategori_lomba()
    {
        $response = $this->post('/kategori-lomba/store', [
            'kategori_lomba' => 'Olahraga'
        ]);

        $response->assertRedirect('/kategori-lomba');
        $this->assertDatabaseHas('kategori_lomba', [
            'kategori_lomba' => 'Olahraga'
        ]);
    }

    /** @test */
    

    /** @test */
    public function it_can_update_kategori_lomba()
    {
        $kategori = KategoriLomba::create(['kategori_lomba' => 'Lama']);

        $response = $this->put("/kategori-lomba/{$kategori->kategorilomba_id}", [
            'kategori_lomba' => 'Baru'
        ]);

        $response->assertRedirect('/kategori-lomba');
        $this->assertDatabaseHas('kategori_lomba', ['kategori_lomba' => 'Baru']);
    }

    /** @test */
    public function it_can_delete_kategori_lomba()
    {
        $kategori = KategoriLomba::create(['kategori_lomba' => 'Hapus']);

        $response = $this->delete("/kategori-lomba/{$kategori->kategorilomba_id}");

        $response->assertRedirect('/kategori-lomba');
        $this->assertDatabaseMissing('kategori_lomba', ['kategori_lomba' => 'Hapus']);
    }
}

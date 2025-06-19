<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\KategoriLomba;
use Illuminate\Validation\Rule;
class KategoriLombaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kategoriLomba = KategoriLomba::all();
        // dd($kategoriLomba->toArray());
        return Inertia::render('Kemahasiswaan/KategoriLomba', [
            'flash' => session('success' ? 'success' : 'error'),
            'kategoriLomba' => $kategoriLomba,
        ]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'kategori_lomba' => 'required|string|max:255|',
        ]);

        // Simpan ke database
        KategoriLomba::create($validated);

        // Redirect dengan pesan sukses
        return redirect()->route('kategori-lomba.index')->with('success', 'Kategori Lomba berhasil ditambahkan!');

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, KategoriLomba $kategoriLomba)
    {
        $request->validate([
            'kategori_lomba' => [
                'required',
                'string',
                'max:255',
                Rule::unique('kategori_lomba', 'kategori_lomba')->ignore($kategoriLomba->kategorilomba_id, 'kategorilomba_id')
            ],
        ]);

        $kategoriLomba->update([
            'kategori_lomba' => $request->kategori_lomba,
        ]);

        return redirect()->route('kategori-lomba.index')->with('success', 'Kategori berhasil diperbarui.');
    }


    // Hapus kategori
    public function destroy(KategoriLomba $kategoriLomba)
    {
        $kategoriLomba->forceDelete();

        return redirect()->route('kategori-lomba.index')->with('success', 'Kategori berhasil dihapus.');
    }
}

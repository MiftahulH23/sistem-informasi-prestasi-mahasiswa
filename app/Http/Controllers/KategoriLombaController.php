<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\KategoriLomba;
class KategoriLombaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $kategoriLomba = KategoriLomba::all();
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
        $request->validate([
            'kategori_lomba' => 'required|string|max:255|unique:kategori_lomba,kategori_lomba',
        ]);

        // Simpan ke database
        KategoriLomba::create([
            'kategori_lomba' => $request->kategori_lomba,
        ]);

        // Redirect dengan pesan sukses
        return redirect()->back()->with('success', 'Kategori Lomba berhasil ditambahkan!');
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
            'kategori_lomba' => 'required|string|max:255|unique:kategori_lomba,kategori_lomba,' . $kategoriLomba->id,
        ]);

        $kategoriLomba->update([
            'kategori_lomba' => $request->kategori_lomba,
        ]);

        return redirect()->route('kategori-lomba')->with('success', 'Kategori berhasil diperbarui.');
    }

    // Hapus kategori
    public function destroy(KategoriLomba $kategoriLomba)
    {
        $kategoriLomba->delete();

        return redirect()->route('kategori-lomba')->with('success', 'Kategori berhasil dihapus.');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\KategoriLomba;
use App\Models\JudulLomba;
class JudulLombaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {
        return Inertia::render('Kemahasiswaan/JudulLomba', [
            'kategoriLomba' => KategoriLomba::all(),
            'judulLomba' => JudulLomba::with('kategori')->get()
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
    public function store(Request $request) {
        $request->validate([
            'judul_lomba' => 'required|string',
            'kategori_lomba_id' => 'required|exists:kategori_lomba,id',
        ]);
        JudulLomba::create($request->all());
        return redirect()->route('judul-lomba');
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
    public function update(Request $request, JudulLomba $judulLomba)
    {
        $request->validate([
            'judul_lomba' => 'required|string|max:255',
            'kategori_lomba_id' => 'required|exists:kategori_lomba,id'
        ]);

        $judulLomba->update($request->all());

        return redirect()->route('judul-lomba')->with('success', 'Judul lomba berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JudulLomba $judulLomba)
    {
        $judulLomba->delete();

        return redirect()->route('judul-lomba')->with('success', 'Judul lomba berhasil dihapus.');
    }
}

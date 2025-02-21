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
            'kategorilomba_id' => 'required|exists:kategori_lomba,kategorilomba_id',
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
            'kategorilomba_id' => 'required|exists:kategori_lomba,kategorilomba_id',
        ]);

        $judulLomba->update([
            'judul_lomba' => $request->judul_lomba,
            'kategorilomba_id' => $request->kategorilomba_id,
        ]);

        return back()->with('success', 'Judul Lomba berhasil diperbarui!');
    }

    public function destroy(JudulLomba $judulLomba)
    {
        $judulLomba->delete();

        return back()->with('success', 'Judul Lomba berhasil dihapus.');
    }
}

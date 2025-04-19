<?php

namespace App\Http\Controllers;

use App\Models\Bimbingan;
use App\Models\PengajuanLomba;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BimbinganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pengajuanLomba = PengajuanLomba::where('user_id', auth()->user()->id)
            ->where('status', 'Diterima')
            ->with('dosen')
            ->get();
        // dd($pengajuanLomba->toArray());
        return Inertia::render('Mahasiswa/Bimbingan', [
            'pengajuanLomba' => $pengajuanLomba,
        ]);
    }
    public function indexDosen()
    {
        $pengajuanLomba = PengajuanLomba::where('dosen_pembimbing', auth()->user()->id)
            ->where('status', 'Diterima')
            ->with('dosen')
            ->get();
        // dd($pengajuanLomba->toArray());
        return Inertia::render('Dosen/Bimbingan', [
            'pengajuanLomba' => $pengajuanLomba,
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create($pengajuanlomba_id)
    {
        return Inertia::render('Mahasiswa/TambahBimbingan', [
            'pengajuanlomba_id' => $pengajuanlomba_id
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $pengajuanlomba_id)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'jam_mulai' => 'required',
            'jam_selesai' => 'required',
            'materi_bimbingan' => 'required|string',
            'catatan_bimbingan' => 'required|string',
        ]);

        Bimbingan::create([
            'pengajuanlomba_id' => $pengajuanlomba_id,
            'tanggal' => $request->tanggal,
            'jam_mulai' => $request->jam_mulai,
            'jam_selesai' => $request->jam_selesai,
            'materi_bimbingan' => $request->materi_bimbingan,
            'catatan_bimbingan' => $request->catatan_bimbingan,
            'status' => 'Diajukan',
        ]);

        return redirect("/bimbingan/{$pengajuanlomba_id}")->with('success', 'Bimbingan berhasil ditambahkan!');

    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $bimbingan = Bimbingan::where('pengajuanlomba_id', $id)->get();
        // dd($bimbingan->toArray());
        return Inertia::render('Mahasiswa/DataBimbingan', [
            'bimbingan' => $bimbingan,
            'id' => $id
        ]);
    }
    public function showForDosen($id)
    {
        $bimbingan = Bimbingan::where('pengajuanlomba_id', $id)->get();
        // dd($bimbingan->toArray());
        return Inertia::render('Dosen/DataBimbingan', [
            'bimbingan' => $bimbingan,
            'id' => $id
        ]);
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
    public function update(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:Diterima,Ditolak',
        ]);

        $bimbingan = Bimbingan::findOrFail($id);
        $bimbingan->update(['status' => $request->status]);

        return back()->with('success', 'Status berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

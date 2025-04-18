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
            ->get();
        // dd($pengajuanLomba->toArray());
        return Inertia::render('Mahasiswa/Bimbingan', [
            'pengajuanLomba' => $pengajuanLomba,
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($pengajuanlomba_id)
    {
        $bimbingan = Bimbingan::where('pengajuanlomba_id', $pengajuanlomba_id)->get();
        // dd($bimbingan->toArray());
        return Inertia::render('Mahasiswa/DataBimbingan', [
            'bimbingan' => $bimbingan,
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

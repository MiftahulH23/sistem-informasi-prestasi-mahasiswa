<?php

namespace App\Http\Controllers;
use App\Models\Prestasi;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PrestasiController extends Controller
{
    public function index()
    {
        $query = Prestasi::with(['pengajuanLomba.kategori'])
            ->where('status', 'Diterima');

        $query = Prestasi::with(['pengajuanLomba.kategori']);

        if (Auth::user()->role === 'Mahasiswa') {
            $query->whereHas('pengajuanLomba', function ($q) {
                $q->whereJsonContains('anggota_kelompok', Auth::id());
            })->where('capaian_prestasi', '!=', 'Peserta');
        }

        $prestasi = $query->get();


        $prestasi = $query->get();

        // // Loop untuk inject nama anggota
        // $prestasi->each(function ($item) {
        //     $anggotaIds = $item->pengajuanLomba->anggota_kelompok ?? [];
        //     $item->pengajuanLomba->anggota_nama = User::whereIn('id', $anggotaIds)->pluck('name');
        // });

        return Inertia::render("Prestasi", ["prestasi" => $prestasi]);
    }

}

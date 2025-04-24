<?php

namespace App\Http\Controllers;
use App\Models\Prestasi;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PrestasiController extends Controller
{
    public function index()
    {
        $query = Prestasi::with(['pengajuanLomba.kategori'])
            ->where('status', 'Diterima');

        if (Auth::user()->role === 'Mahasiswa') {
            $query->where('user_id', Auth::id())
                ->where('capaian_prestasi', '!=', 'Peserta');
        }

        $prestasi = $query->get();

        return Inertia::render("Prestasi", ["prestasi" => $prestasi]);
    }

}

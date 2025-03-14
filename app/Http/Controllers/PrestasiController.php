<?php

namespace App\Http\Controllers;

use App\Models\PengajuanLomba;
use App\Models\Prestasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrestasiController extends Controller
{
    public function index()
    {
        $data = Prestasi::with(['pengajuanLomba.kategori'])->where('status', 'Diterima')->get();

        return Inertia::render("Prestasi", ["data" => $data]);
    }

}

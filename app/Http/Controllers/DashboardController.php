<?php

namespace App\Http\Controllers;

use App\Models\PengajuanLomba;
use App\Models\Prestasi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $oneYearAgo = Carbon::now()->subYear();

        // Mapping singkatan program studi
        $programSingkatan = [
            'Sistem Informasi' => 'SI',
            'Teknik Informatika' => 'TI',
            'Teknik Elektro' => 'TE',
            'Teknik Mesin' => 'TM',
            'Teknik Sipil' => 'TS',
            'Manajemen Informatika' => 'MI',
            'Akuntansi' => 'AK',
        ];

        // Ambil data dari tabel `prestasi` dengan relasi ke `pengajuanlomba`
        $chartData = Prestasi::where('status', 'Diterima')
            ->where('created_at', '>=', $oneYearAgo)
            ->with('pengajuanlomba') // Mengambil data dari tabel `pengajuanlomba`
            ->get()
            ->groupBy(fn($item) => $item->pengajuanlomba->program_studi) // Grup berdasarkan program studi
            ->map(function ($items, $programStudi) use ($programSingkatan) {
                return [
                    'program_studi' => $programSingkatan[$programStudi] ?? $programStudi,
                    'total' => $items->count(),
                ];
            })
            ->values();

        $lineChartData = Prestasi::where('status', 'Diterima')
            ->whereHas('pengajuanlomba', function ($query) use ($oneYearAgo) {
                $query->where('tanggal_mulai', '>=', $oneYearAgo);
            })
            ->with('pengajuanlomba')
            ->get()
            ->groupBy(function ($item) {
                return Carbon::parse($item->pengajuanlomba->tanggal_mulai)->format('F'); // Grup berdasarkan bulan
            })
            ->map(function ($items, $month) {
                return [
                    'month' => $month,
                    'Akademik' => $items->where('pengajuanlomba.jenis_lomba', 'Akademik')->count(),
                    'Non-Akademik' => $items->where('pengajuanlomba.jenis_lomba', 'Non-Akademik')->count(),
                ];
            })
            ->sortBy(function ($item) {
                return Carbon::parse($item['month'])->month; // Urutkan berdasarkan bulan (1-12)
            })
            ->values();


        $TingkatLomba = Prestasi::where('status', 'Diterima')
            ->where('created_at', '>=', $oneYearAgo)
            ->with('pengajuanlomba') // Mengambil data dari tabel `pengajuanlomba`
            ->get()
            ->groupBy(fn($item) => optional($item->pengajuanlomba)->tingkat_lomba) // Grup berdasarkan tingkat lomba
            ->map(function ($items, $TingkatLomba) {
                return [
                    'tingkat_lomba' => $TingkatLomba, // Menggunakan tingkat lomba yang benar
                    'total' => $items->count(),
                ];
            })
            ->values();



        return Inertia::render('Dashboard', [
            'chartData' => $chartData,
            'lineChartData' => $lineChartData,
            'TingkatLomba' => $TingkatLomba,
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

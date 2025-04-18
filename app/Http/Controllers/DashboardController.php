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
use Illuminate\Support\Collection;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'chartData' => $this->getChartDataByProgramStudi(),
            'lineChartData' => $this->getLineChartData(),
            'TingkatLomba' => $this->getChartDataByTingkatLomba(),
            'KategoriLomba' => $this->getChartDataByKategoriLomba(),
        ]);
    }

    private function getChartDataByProgramStudi()
    {
        $oneYearAgo = Carbon::now()->subYear();

        $programSingkatan = [
            'Sistem Informasi' => 'SI',
            'Teknik Informatika' => 'TI',
            'Teknologi Rekayasa Mekatronika' => 'TRM',
            'Teknik Mesin' => 'TM',
            'Teknik Listrik' => 'TL',
            'Teknik Rekayasa Komputer' => 'TRK',
            'Akuntansi' => 'AK',
        ];

        // Ambil data prestasi sesuai filter
        $dataPrestasi = Prestasi::where('status', 'Diterima')
            ->where('created_at', '>=', $oneYearAgo)
            ->with('pengajuanlomba')
            ->get()
            ->groupBy(fn($item) => $item->pengajuanlomba->program_studi);

        // Loop semua program studi, isi total kalau ada, kalau nggak set 0
        $chartData = collect($programSingkatan)->map(function ($singkatan, $namaProdi) use ($dataPrestasi) {
            return [
                'program_studi' => $singkatan,
                'nama_lengkap' => $namaProdi, // Tambahkan ini
                'total' => isset($dataPrestasi[$namaProdi]) ? $dataPrestasi[$namaProdi]->count() : 0,
            ];
        })->sortByDesc('total')->values();


        return $chartData;
    }


    private function getLineChartData()
    {
        $oneYearAgo = Carbon::now()->subYear();

        $months = collect([
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ]);

        $prestasi = Prestasi::where('status', 'Diterima')
            ->whereHas('pengajuanlomba', fn($query) => $query->where('tanggal_mulai', '>=', $oneYearAgo))
            ->with('pengajuanlomba')
            ->get()
            ->groupBy(fn($item) => Carbon::parse($item->pengajuanlomba->tanggal_mulai)->format('F'))
            ->map(function ($items, $month) {
                return [
                    'month' => $month,
                    'Akademik' => $items->where('pengajuanlomba.jenis_lomba', 'Akademik')->count(),
                    'Non-Akademik' => $items->where('pengajuanlomba.jenis_lomba', 'Non-Akademik')->count(),
                ];
            });

        return $months->map(function ($month) use ($prestasi) {
            $data = $prestasi->firstWhere('month', $month);
            return [
                'month' => $month,
                'Akademik' => $data['Akademik'] ?? 0,
                'Non-Akademik' => $data['Non-Akademik'] ?? 0,
            ];
        });
    }

    private function getChartDataByTingkatLomba()
    {
        $oneYearAgo = Carbon::now()->subYear();

        $data = Prestasi::where('status', 'Diterima')
            ->where('created_at', '>=', $oneYearAgo)
            ->with('pengajuanlomba')
            ->get()
            ->groupBy(fn($item) => optional($item->pengajuanlomba)->tingkat_lomba)
            ->map(fn($items, $tingkat) => [
                'tingkat_lomba' => $tingkat,
                'total' => $items->count(),
            ])
            ->values();

        // Kategori yang harus selalu ada
        $requiredCategories = ['Lokal-Wilayah', 'Provinsi', 'Nasional', 'Internasional'];

        // Pastikan kategori-kategori ini ada, meskipun totalnya 0
        foreach ($requiredCategories as $category) {
            if (!$data->contains('tingkat_lomba', $category)) {
                $data->push([
                    'tingkat_lomba' => $category,
                    'total' => 0,
                ]);
            }
        }

        return $data;
    }


    private function getChartDataByKategoriLomba()
    {
        $oneYearAgo = Carbon::now()->subYear();

        return Prestasi::where('status', 'Diterima')
            ->where('created_at', '>=', $oneYearAgo)
            ->with('pengajuanlomba.kategori')
            ->get()
            ->groupBy(fn($item) => optional($item->pengajuanlomba->kategori)->kategori_lomba)
            ->map(fn($items, $kategori) => [
                'kategori_lomba' => $kategori ?? 'Tidak Diketahui',
                'total' => $items->count(),
            ])
            ->values();
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

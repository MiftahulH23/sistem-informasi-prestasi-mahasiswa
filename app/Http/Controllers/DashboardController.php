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
        $totalPengajuanDiterima = PengajuanLomba::where('status', 'Diterima')->count();
        $totalPrestasiDiterima = Prestasi::where('status', 'Diterima')
            ->where('capaian_prestasi', '!=', 'Peserta')
            ->count();
        return Inertia::render('Dashboard', [
            'chartData' => $this->getChartDataByProgramStudi(),
            'lineChartData' => $this->getLineChartData(),
            'TingkatLomba' => $this->getChartDataByTingkatLomba(),
            'KategoriLomba' => $this->getChartDataByKategoriLomba(),
            'total_pengajuan' => $totalPengajuanDiterima,
            'total_prestasi' => $totalPrestasiDiterima,
            'persentase_prestasi' => $this->getPrestasiPercentage(),
        ]);
    }
    public function getPrestasiPercentage()
    {
        $totalPengajuanDiterima = PengajuanLomba::where('status', 'Diterima')->count();

        $totalPrestasiNonPeserta = Prestasi::where('status', 'Diterima')
            ->whereHas('pengajuanLomba', function ($query) {
                $query->where('status', 'Diterima');
            })
            ->where('capaian_prestasi', '!=', 'Peserta')
            ->count();

        return $totalPengajuanDiterima > 0
            ? round(($totalPrestasiNonPeserta / $totalPengajuanDiterima) * 100, 2)
            : 0;
    }



    private function getChartDataByProgramStudi()
    {
        $oneYearAgo = Carbon::now()->subYear();

        $programSingkatan = [
            'Teknik Elektronika Telekomunikasi' => 'TET',
            'Teknik Listrik' => 'TL',
            'Teknik Mesin' => 'TM',
            'Teknologi Rekayasa Jaringan Telekomunikasi' => 'TRJT',
            'Teknologi Rekayasa Sistem Elektronika' => 'TRSE',
            'Teknologi Rekayasa Mekatronika' => 'TRM',
            'Teknik Informatika' => 'TI',
            'Sistem Informasi' => 'SI',
            'Teknologi Rekayasa Komputer' => 'TRK',
            'Akuntansi Perpajakan' => 'AktP',
            'Hubungan Masyarakat dan Komunikasi Digital' => 'HMKD',
            'Bisnis Digital' => 'BD',
        ];

        // Siapkan counter array biasa
        $counter = [];
        foreach ($programSingkatan as $namaProdi => $singkatan) {
            $counter[$namaProdi] = 0;
        }

        $dataPrestasi = Prestasi::where('status', 'Diterima')
            ->where('created_at', '>=', $oneYearAgo)
            ->where('capaian_prestasi', '!=', 'Peserta')
            ->with('pengajuanlomba')
            ->get();

        foreach ($dataPrestasi as $item) {
            $pengajuan = $item->pengajuanlomba;

            if (!$pengajuan)
                continue;

            $prodiList = $pengajuan->program_studi;
            $prodiList = is_array($prodiList) ? $prodiList : [$prodiList];

            foreach ($prodiList as $prodiSingkatan) {
                $namaLengkap = array_search(strtoupper($prodiSingkatan), $programSingkatan);

                if ($namaLengkap) {
                    $counter[$namaLengkap]++;
                }
            }
        }

        $chartData = collect($programSingkatan)->map(function ($singkatan, $namaProdi) use ($counter) {
            return [
                'program_studi' => $singkatan,
                'nama_lengkap' => $namaProdi,
                'total' => $counter[$namaProdi] ?? 0,
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
            ->where('capaian_prestasi', '!=', 'Peserta')
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
            ->where('capaian_prestasi', '!=', 'Peserta')
            ->with('pengajuanlomba')
            ->get()
            ->groupBy(fn($item) => optional($item->pengajuanlomba)->tingkat_lomba)
            ->map(fn($items, $tingkat) => [
                'tingkat_lomba' => $tingkat,
                'total' => $items->count(),
            ])
            ->values();

        $requiredCategories = ['Lokal-Wilayah', 'Provinsi', 'Nasional', 'Internasional'];

        // Tambahkan kategori yang tidak ada
        foreach ($requiredCategories as $category) {
            if (!$data->contains('tingkat_lomba', $category)) {
                $data->push([
                    'tingkat_lomba' => $category,
                    'total' => 0,
                ]);
            }
        }

        // Urutkan berdasarkan urutan kategori
        $data = $data->sortBy(function ($item) use ($requiredCategories) {
            return array_search($item['tingkat_lomba'], $requiredCategories);
        })->values();

        return $data;
    }



    private function getChartDataByKategoriLomba()
    {
        $oneYearAgo = Carbon::now()->subYear();

        return Prestasi::where('status', 'Diterima')
            ->where('created_at', '>=', $oneYearAgo)
            ->with('pengajuanlomba.kategori')
            ->where('capaian_prestasi', '!=', 'Peserta')    
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

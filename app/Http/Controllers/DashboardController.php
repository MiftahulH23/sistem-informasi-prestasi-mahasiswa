<?php

namespace App\Http\Controllers;

use App\Models\PengajuanLomba;
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

        // Mapping nama Program Studi ke Singkatan
        $programSingkatan = [
            'Sistem Informasi' => 'SI',
            'Teknik Informatika' => 'TI',
            'Teknik Elektro' => 'TE',
            'Teknik Mesin' => 'TM',
            'Teknik Sipil' => 'TS',
            'Manajemen Informatika' => 'MI',
            'Akuntansi' => 'AK',
        ];

        // Ambil data dari database
        $chartData = PengajuanLomba::select('program_studi', DB::raw('count(*) as total'))
            ->where('created_at', '>=', $oneYearAgo)
            ->groupBy('program_studi')
            ->orderBy('total', 'desc')
            ->get()
            ->map(function ($item) use ($programSingkatan) {
                return [
                    'program_studi' => $programSingkatan[$item->program_studi] ?? $item->program_studi,
                    'total' => $item->total,
                ];
            })
            ->toArray();

        return Inertia::render('Dashboard', [
            'chartData' => $chartData,
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
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

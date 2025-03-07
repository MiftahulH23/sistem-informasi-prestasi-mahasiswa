<?php

namespace App\Http\Controllers;

use App\Models\KategoriLomba;
use App\Models\PengajuanLomba;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Prestasi;
use Illuminate\Support\Str;

class PelaporanPrestasiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $prestasi = Prestasi::with('pengajuanLomba')->where('user_id', Auth::id())->get();
        return Inertia::render('Mahasiswa/PelaporanPrestasi', [
            'prestasi' => $prestasi
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $lombaOptions = PengajuanLomba::where('status', 'Diterima')
            ->pluck('judul_lomba', 'pengajuanlomba_id'); // Menggunakan pengajuanlomba_id

        return Inertia('Mahasiswa/TambahLaporanPrestasi', [
            'lombaOptions' => $lombaOptions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'pengajuanlomba_id' => 'required|exists:pengajuan_lomba,pengajuanlomba_id',
            'capaian_prestasi' => 'required|string',
            'sertifikat' => 'nullable|file|mimes:pdf|max:2048',
            'dokumentasi.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'url_media_sosial' => 'nullable|url',
            'surat_tugas' => 'nullable|file|mimes:pdf|max:2048',
        ]);

        // Upload Sertifikat jika ada
        $sertifikatPath = $request->file('sertifikat') ? $request->file('sertifikat')->store('sertifikat', 'public') : null;

        // Upload Dokumentasi jika ada
        $dokumentasiPaths = [];
        if ($request->hasFile('dokumentasi')) {
            foreach ($request->file('dokumentasi') as $file) {
                $path = $file->store('dokumentasi', 'public');
                $dokumentasiPaths[] = $path;
            }
        }
        $suratTugasPath = $request->file('surat_tugas') ? $request->file('surat_tugas')->store('surat_tugas/prestasi', 'public') : null;
        Prestasi::create([
            'prestasi_id' => Str::uuid(), // UUID
            'pengajuanlomba_id' => $request->pengajuanlomba_id,
            'user_id' => Auth::id(),
            'capaian_prestasi' => $request->capaian_prestasi,
            'sertifikat' => $sertifikatPath,
            'dokumentasi' => json_encode($dokumentasiPaths),
            'url_media_sosial' => $request->url_media_sosial,
            'surat_tugas' => $suratTugasPath,
            'status' => 'Diajukan', // Default status
        ]);

        return redirect()->back()->with('success', 'Laporan Prestasi berhasil ditambahkan!');
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
    public function editStatus()
    {
        $prestasi = Prestasi::with('pengajuanLomba')->get();
        // dd($pelaporanPrestasi->toArray());
        return Inertia::render('Kemahasiswaan/UpdateStatusPelaporanPrestasi', [
            'prestasi' =>$prestasi,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Diterima,Ditolak',
        ]);

        $pelaporanPrestasi = Prestasi::findOrFail($id);
        $pelaporanPrestasi->update(['status' => $request->status]);

        return back()->with('success', 'Status berhasil diperbarui.');
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

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
        $prestasi = Prestasi::with(['pengajuanLomba.kategori'])
            ->where('user_id', Auth::id())
            ->get();
        return Inertia::render('Mahasiswa/PelaporanPrestasi', [
            'prestasi' => $prestasi
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $userId = auth()->id();

        // Ambil semua pengajuan lomba milik user yang statusnya Diterima
        $pengajuans = PengajuanLomba::where('status', 'Diterima')
            ->where('user_id', $userId)
            ->get();

        // Filter hanya yang belum ada prestasi atau semua prestasinya Ditolak
        $filtered = $pengajuans->filter(function ($pengajuan) {
            $prestasi = $pengajuan->prestasi;

            if ($prestasi->isEmpty()) {
                return true; // belum ada prestasi sama sekali
            }

            // kalau semua statusnya Ditolak, maka bisa
            return $prestasi->every(function ($p) {
                return $p->status === 'Ditolak';
            });
        });

        // Ambil judul dan ID-nya
        $lombaOptions = $filtered->pluck('judul_lomba', 'pengajuanlomba_id');

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
        $validated=$request->validate([
            'pengajuanlomba_id' => 'required|exists:pengajuan_lomba,pengajuanlomba_id',
            'capaian_prestasi' => 'required|string',
            'sertifikat' => 'required|file|mimes:pdf|max:5120',
            'dokumentasi.*' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
            'url_media_sosial' => 'nullable|url',
        ], [
            'pengajuanlomba_id.required' => 'Pengajuan lomba harus dipilih.',
            'pengajuanlomba_id.exists' => 'Pengajuan lomba yang dipilih tidak valid.',

            'capaian_prestasi.required' => 'Capaian prestasi harus diisi.',
            'capaian_prestasi.string' => 'Capaian prestasi harus berupa teks.',

            'sertifikat.file' => 'Sertifikat harus berupa file.',
            'sertifikat.mimes' => 'Sertifikat harus berupa file PDF.',
            'sertifikat.max' => 'Ukuran sertifikat tidak boleh lebih dari 5MB.',

            'dokumentasi.*.image' => 'Setiap dokumentasi harus berupa gambar.',
            'dokumentasi.*.mimes' => 'Format gambar dokumentasi harus jpeg, png, jpg, atau gif.',
            'dokumentasi.*.max' => 'Ukuran masing-masing dokumentasi tidak boleh lebih dari 5MB.',

            'url_media_sosial.url' => 'Link media sosial tidak valid.',
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

        $validated['sertifikat'] = $sertifikatPath;
        $validated['dokumentasi'] = json_encode($dokumentasiPaths);
        $validated['user_id'] = Auth::id();
        $validated['status'] = 'Diterima'; // Default status
        Prestasi::create($validated);

        return redirect("/pelaporan-prestasi")->with('success', 'Laporan Prestasi berhasil ditambahkan!');
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
        $prestasi = Prestasi::with('pengajuanLomba.user')->get();
        // dd($prestasi->toArray());
        return Inertia::render('Kemahasiswaan/UpdateStatusPelaporanPrestasi', [
            'prestasi' => $prestasi,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Diterima,Ditolak',
            'catatan' => 'nullable|string',
        ]);

        $pelaporanPrestasi = Prestasi::findOrFail($id);
        $pelaporanPrestasi->update(['status' => $request->status]);
        $pelaporanPrestasi->catatan = $request->catatan;
        $pelaporanPrestasi->save();

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

<?php

namespace App\Http\Controllers;

use App\Models\PengajuanLomba;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\KategoriLomba;
use App\Models\JudulLomba;
class PengajuanLombaController extends Controller
{
    public function index()
    {
        $pengajuanLomba = PengajuanLomba::with('kategori') // Ambil data kategori juga
            ->where('user_id', Auth::id())
            ->get();
            // dd($pengajuanLomba->toArray());
        return Inertia::render('Mahasiswa/DataPengajuanLomba', [
            'pengajuanLomba' => $pengajuanLomba,
        ]);
        
    }


    public function create()
    {
        return Inertia::render('Mahasiswa/PengajuanLomba', [
            'kategoriLomba' => KategoriLomba::all(),
            'judulLomba' => JudulLomba::with('kategori')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori_lomba_id' => 'required|integer',
            'judul_lomba' => 'required|string',
            'jenis_lomba' => 'required|string',
            'tingkat_lomba' => 'required|string',
            'model_pelaksanaan' => 'required|string',
            'dosen_pembimbing' => 'required|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date',
            'jenis_kepesertaan' => 'required|in:Individu,Kelompok',
            'anggota_kelompok' => 'nullable|array',
            'anggota_kelompok.*' => 'string',
            'surat_tugas' => 'required|file|mimes:pdf|max:2048',
        ]);

        // Ambil user yang login
        $user = Auth::user();
        $anggota_kelompok = $request->anggota_kelompok ?? [];
        if ($request->jenis_kepesertaan === 'Kelompok') {
            if (!in_array($user->name, $anggota_kelompok)) {
                array_unshift($anggota_kelompok, (string) $user->name);
            }
        } else {
            $anggota_kelompok = [(string) $user->name];
        }
        $jumlah_peserta = ($request->jenis_kepesertaan === 'Individu') ? 1 : count($anggota_kelompok);


        $surat_tugas_path = $request->file('surat_tugas')->store('surat_tugas', 'public');

        // Simpan data ke database
        $pengajuan = PengajuanLomba::create([
            'user_id' => $user->id, // ID user yang login tetap sebagai pemilik pengajuan
            'kategori_lomba_id' => $request->kategori_lomba_id,
            'judul_lomba' => $request->judul_lomba,
            'jenis_lomba' => $request->jenis_lomba,
            'tingkat_lomba' => $request->tingkat_lomba,
            'model_pelaksanaan' => $request->model_pelaksanaan,
            'dosen_pembimbing' => $request->dosen_pembimbing,
            'status' => 'Diajukan',
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'jenis_kepesertaan' => $request->jenis_kepesertaan,
            'jumlah_peserta' => $jumlah_peserta, // Jumlah peserta dihitung dengan benar
            'anggota_kelompok' => $anggota_kelompok, // Sudah termasuk user yang login jika kelompok
            'surat_tugas' => $surat_tugas_path,
        ]);
        return redirect()->back()->with('success', 'Pengajuan Lomba berhasil ditambahkan!');
    }

}


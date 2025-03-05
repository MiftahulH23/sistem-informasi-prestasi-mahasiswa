<?php

namespace App\Http\Controllers;

use App\Models\PengajuanLomba;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\KategoriLomba;
use App\Models\JudulLomba;
use App\Models\User;
use App\Notifications\Pengajuan;
use Illuminate\Support\Facades\Notification;

class PengajuanLombaController extends Controller
{
    public function index()
    {
        $pengajuanLomba = PengajuanLomba::with('kategori') // Ambil data kategori juga
            ->where('user_id', Auth::id())
            ->get();
        $kategoriLomba = KategoriLomba::all();
        return Inertia::render('Mahasiswa/PengajuanLomba', [
            'pengajuanLomba' => $pengajuanLomba,
            'kategoriLomba' => $kategoriLomba,
        ]);

    }
    public function indexKemahasiswaan()
    {
        $pengajuanLomba = PengajuanLomba::with('kategori') // Ambil data kategori juga
            ->where('user_id', Auth::id())
            ->get();
        $kategoriLomba = KategoriLomba::all();
        // dd($pengajuanLomba->toArray());
        return Inertia::render('Kemahasiswaan/DataPengajuanLomba', [
            'pengajuanLomba' => $pengajuanLomba,
            'kategoriLomba' => $kategoriLomba,
        ]);

    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Diterima,Ditolak',
        ]);

        $pengajuanLomba = PengajuanLomba::findOrFail($id);
        $pengajuanLomba->update(['status' => $request->status]);

        return back()->with('success', 'Status berhasil diperbarui.');
    }


    public function create()
    {
        return Inertia::render('Mahasiswa/TambahPengajuanLomba', [
            'kategoriLomba' => KategoriLomba::all(),
            'judulLomba' => JudulLomba::with('kategori')->get()
        ]);
    }

    public function store(Request $request)
    {
        try {


            $request->validate([
                'kategorilomba_id' => 'required',
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
                'surat_tugas' => 'required|file|mimes:pdf|max:5120',
            ], [
                'kategorilomba_id.required' => 'Kategori lomba wajib diisi.',
                'judul_lomba.required' => 'Judul lomba wajib diisi.',
                'judul_lomba.string' => 'Judul lomba harus berupa teks.',
                'jenis_lomba.required' => 'Jenis lomba wajib diisi.',
                'jenis_lomba.string' => 'Jenis lomba harus berupa teks.',
                'tingkat_lomba.required' => 'Tingkat lomba wajib diisi.',
                'tingkat_lomba.string' => 'Tingkat lomba harus berupa teks.',
                'model_pelaksanaan.required' => 'Model pelaksanaan wajib diisi.',
                'model_pelaksanaan.string' => 'Model pelaksanaan harus berupa teks.',
                'dosen_pembimbing.required' => 'Dosen pembimbing wajib diisi.',
                'dosen_pembimbing.string' => 'Dosen pembimbing harus berupa teks.',
                'tanggal_mulai.required' => 'Tanggal mulai wajib diisi.',
                'tanggal_mulai.date' => 'Tanggal mulai harus berupa tanggal yang valid.',
                'tanggal_selesai.required' => 'Tanggal selesai wajib diisi.',
                'tanggal_selesai.date' => 'Tanggal selesai harus berupa tanggal yang valid.',
                'jenis_kepesertaan.required' => 'Jenis kepesertaan wajib diisi.',
                'jenis_kepesertaan.in' => 'Jenis kepesertaan harus berupa "Individu" atau "Kelompok".',
                'anggota_kelompok.array' => 'Anggota kelompok harus berupa array.',
                'anggota_kelompok.*.string' => 'Setiap anggota kelompok harus berupa teks.',
                'surat_tugas.required' => 'Surat tugas wajib diunggah.',
                'surat_tugas.file' => 'Surat tugas harus berupa file.',
                'surat_tugas.mimes' => 'Surat tugas harus berformat PDF.',
                'surat_tugas.max' => 'Ukuran surat tugas tidak boleh lebih dari 5MB.',
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
            // dd($request->all());
            // Simpan data ke database
            $pengajuan = PengajuanLomba::create([
                'user_id' => $user->id, // ID user yang login tetap sebagai pemilik pengajuan
                'kategorilomba_id' => $request->kategorilomba_id,
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



            return redirect()->back()->with('success', 'Pengajuan Lomba berhasil ditambahkan! dari b');
        } catch (Exception $e) {
            return redirect()->back()->with('errors', $e->getMessage());
        }
    }

    public function show($id)
    {
        $pengajuanLomba = PengajuanLomba::with('kategori')->findOrFail($id);
        return Inertia::render('Mahasiswa/DetailPengajuanLomba', [
            'pengajuanLomba' => $pengajuanLomba,
        ]);
    }

    public function notify()
    {
        $user = Auth::user();
        $email = "miftahul21si@mahasiswa.pcr.ac.id";
        $message = "Halo, ada pengajuan lomba baru yang perlu ditinjau dari $user->name. Silakan periksa detailnya.";

        Notification::route('mail', $email)
            ->notify(new Pengajuan($message));

        return "Notifikasi berhasil dikirim!";
    }

}


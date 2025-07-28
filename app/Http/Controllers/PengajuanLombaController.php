<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Auth\SocialiteController;
use App\Models\PengajuanLomba;
use App\Models\Prestasi;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use App\Models\KategoriLomba;
use App\Models\JudulLomba;
use App\Models\User;
use App\Notifications\Pengajuan;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Hash;
use Exception;

class PengajuanLombaController extends Controller
{
    public function index()
    {
        $pengajuanLomba = PengajuanLomba::whereJsonContains('anggota_kelompok', auth()->id())
            ->with(['kategori'])
            ->get()
            ->map(function ($item) {

                $dosen_ids = $item->dosen_pembimbing ?? [];
                if (!is_array($dosen_ids)) {
                    $dosen_ids = json_decode($dosen_ids, true);
                }

                $dosen_nama = User::whereIn('id', $dosen_ids)->pluck('inisial')->toArray();

                $item->dosen_pembimbing = implode(', ', $dosen_nama);

                return $item;
            });
        return Inertia::render('Mahasiswa/PengajuanLomba', [
            'pengajuanLomba' => $pengajuanLomba,
        ]);
    }

    public function editStatus()
    {
        $pengajuanLomba = PengajuanLomba::with(['kategori', 'user'])
            ->get();
        $kategoriLomba = KategoriLomba::all();
        // dd($pengajuanLomba->toArray());
        return Inertia::render('Kemahasiswaan/UpdateStatusPengajuanLomba', [
            'pengajuanLomba' => $pengajuanLomba,
            'kategoriLomba' => $kategoriLomba,
        ]);

    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Diterima,Ditolak',
            'catatan' => 'required|string',
        ], [
            'catatan.required' => 'Catatan wajib diisi.',
            'catatan.string' => 'Catatan harus berupa teks.',
        ]);

        $pengajuan = PengajuanLomba::findOrFail($id);
        $pengajuan->status = $request->status;
        $pengajuan->catatan = $request->catatan; // simpan catatan juga
        $pengajuan->save();

        return back()->with('success', 'Status pengajuan berhasil diperbarui.');
    }



    public function create()
    {
        $url = "https://v2.api.pcr.ac.id/api/pegawai?collection=pegawai-aktif";
        $response = Http::withHeaders([
            'apikey' => env('API_KEY_PCR'),
        ])->post($url);

        $responseData = $response->json();

        $pegawai = $responseData['items'] ?? []; // Ambil bagian 'items'

        $data = array_filter($pegawai, function ($item) {
            return isset($item['posisi']) && $item['posisi'] === 'Dosen';
        });

        // Konversi ke array dengan format value & label
        $dosenList = array_map(function ($item) {
            return [
                'value' => $item['email'],
                'label' => $item['inisial'],
            ];
        }, $data);
        $dosenList[] = [
            'value' => 'hibatillah21si@mahasiswa.pcr.ac.id',
            'label' => 'HBT',
        ];

        return Inertia::render('Mahasiswa/TambahPengajuanLomba', [
            'kategoriLomba' => KategoriLomba::all(),
            'judulLomba' => JudulLomba::with('kategori')->get(),
            'mahasiswaList' => User::where('role', 'Mahasiswa')
                ->where('id', '!=', auth()->id())
                ->get(),
            'dosenList' => array_values($dosenList),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'kategorilomba_id' => 'required',
            'judul_lomba' => 'required|string',
            'jenis_lomba' => 'required|string',
            'tingkat_lomba' => 'required|string',
            'model_pelaksanaan' => 'required|string',
            'dosen_pembimbing' => 'required|array',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date',
            'jenis_kepesertaan' => 'required|in:Individu,Kelompok',
            'anggota_kelompok' => 'nullable|array',
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
            'dosen_pembimbing.required' => 'Dosen pembimbing harus diisi.',
            'tanggal_mulai.required' => 'Tanggal mulai wajib diisi.',
            'tanggal_mulai.date' => 'Tanggal mulai harus berupa tanggal yang valid.',
            'tanggal_selesai.required' => 'Tanggal selesai wajib diisi.',
            'tanggal_selesai.date' => 'Tanggal selesai harus berupa tanggal yang valid.',
            'jenis_kepesertaan.required' => 'Jenis kepesertaan wajib diisi.',
            'jenis_kepesertaan.in' => 'Jenis kepesertaan harus berupa "Individu" atau "Kelompok".',
            'anggota_kelompok.array' => 'Anggota kelompok harus berupa array.',
            'surat_tugas.required' => 'Surat tugas wajib diunggah.',
            'surat_tugas.file' => 'Surat tugas harus berupa file.',
            'surat_tugas.mimes' => 'Surat tugas harus berformat PDF.',
            'surat_tugas.max' => 'Ukuran surat tugas tidak boleh lebih dari 5MB.',
        ]);


        // Ambil user yang login
        $user = Auth::user();
        $dosen_pembimbing_email = $request->dosen_pembimbing;

        foreach ($dosen_pembimbing_email as $email) {

            $dosen = User::where('email', $email)->first();
            if ($dosen)
                continue;

            if ($email === 'hibatillah21si@mahasiswa.pcr.ac.id') {
                User::create([
                    'name' => 'M. Hibatillah Hasanin',
                    'email' => $email,
                    'inisial' => 'HBT',
                    'role' => 'Dosen',
                    'password' => Hash::make('123'),
                ]);
                continue;
            }

            $url = "https://v2.api.pcr.ac.id/api/pegawai?collection=pegawai-aktif";
            $response = Http::withHeaders([
                'apikey' => env('API_KEY_PCR'),
            ])->post($url);

            $responseData = $response->json();
            $pegawai = $responseData['items'] ?? [];

            $data = array_filter($pegawai, fn($item) => isset($item['email']) && $item['email'] === $email);

            $dosenData = reset($data);

            User::create([
                'name' => $dosenData['nama'] ?? 'Dosen Tidak Diketahui',
                'email' => $dosenData['email'] ?? $email,
                'inisial' => $dosenData['inisial'] ?? null,
                'role' => 'Dosen',
                'password' => Hash::make('123'),
            ]);
        }


        $dosen_pembimbing = User::whereIn('email', $dosen_pembimbing_email)
            ->pluck('id')
            ->toArray();



        $anggota_kelompok = $request->anggota_kelompok ?? [];
        $jenisKepesertaan = $request->jenis_kepesertaan;
        $user = auth()->user();

        $userUdahAda = array_map(
            fn($item) => intval($item['value'] ?? 0),
            array_filter($anggota_kelompok, fn($item) => isset($item['value']))
        );

        $userBelumAda = array_filter($anggota_kelompok, fn($item) => !isset($item['value']));

        $userBaru = [];

        // Proses user baru (jika ada input manual)
        if ($jenisKepesertaan === 'Kelompok') {
            foreach ($userBelumAda as $item) {
                $email = trim($item['label'] ?? '');

                $check = SocialiteController::checkEmail($email);

                if (is_string($check)) {
                    throw ValidationException::withMessages([
                        'anggota_kelompok' => ["Email {$email} tidak ditemukan di database. Pastikan email yang dimasukkan benar."]
                    ]);
                }

                $newUser = User::create([
                    'name' => ucwords(strtolower($check->name)),
                    'email' => $check->email,
                    'role' => 'Mahasiswa',
                    'nim' => $check->nim ?? null,
                    'prodi' => $check->prodi ?? null,
                    'password' => Hash::make('123'),
                ]);

                $userBaru[] = $newUser->id;
            }
        }

        $anggota_kelompok = array_merge($userUdahAda, $userBaru);

        // Tambahkan user login ke kelompok jika belum ada
        if ($jenisKepesertaan === 'Kelompok') {
            if (!in_array($user->id, $anggota_kelompok)) {
                array_unshift($anggota_kelompok, $user->id);
            }
        } else {
            $anggota_kelompok = [$user->id];
        }

        $jumlah_peserta = count($anggota_kelompok);
        // Ambil semua prodi unik dari anggota kelompok
        $prodis = User::whereIn('id', $anggota_kelompok)->pluck('prodi')->unique()->values()->all();


        $surat_tugas_path = $request->file('surat_tugas')->store('surat_tugas', 'public');
        // Simpan data ke database
        $validated['user_id'] = $user->id;
        $validated['anggota_kelompok'] = $anggota_kelompok;
        $validated['judul_lomba'] = ucwords(strtolower($request->judul_lomba));
        $validated['dosen_pembimbing'] = $dosen_pembimbing;
        $validated['jumlah_peserta'] = $jumlah_peserta;
        $validated['surat_tugas'] = $surat_tugas_path;
        $validated['program_studi'] = $prodis;
        if (Auth::user()->role === 'Kemahasiswaan') {
            $validated['status'] = 'Diterima';
        } else {
            $validated['status'] = 'Diajukan';
        }

        $pengajuan = PengajuanLomba::create($validated);

        $user = Auth::user();
        $email = "miftahul21si@mahasiswa.pcr.ac.id";
        $message = "Halo, ada pengajuan lomba baru yang perlu ditinjau dari $user->name. Silakan periksa detailnya.";

        Notification::route('mail', $email)
            ->notify(new Pengajuan($message)); // Pastikan implements ShouldQueue


        // $user = Auth::user();
        // $email = "miftahul21si@mahasiswa.pcr.ac.id";
        // $message = "Halo, ada pengajuan lomba baru yang perlu ditinjau dari $user->name. Silakan periksa detailnya.";

        // Notification::route('mail', $email)
        //     ->notify(new Pengajuan($message));
        return redirect('/pengajuan-lomba')->with('success', "Pengajuan berhasil ditambahkan");
    }

    public function kirimEmail()
    {
        $user = Auth::user();
        $email = "miftahul21si@mahasiswa.pcr.ac.id";
        $message = "Halo, ada pengajuan lomba baru yang perlu ditinjau dari $user->name. Silakan periksa detailnya.";
        Notification::route('mail', $email)
            ->notify(new Pengajuan($message));

        return;

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

    public function show($id)
    {
        $pengajuanLomba = PengajuanLomba::with(['kategori'])->findOrFail($id);

        // Ambil user berdasarkan ID yang disimpan di anggota_kelompok
        $anggotaUser = [];
        if (is_array($pengajuanLomba->anggota_kelompok)) {
            $anggotaUser = User::whereIn('id', $pengajuanLomba->anggota_kelompok)
                ->get(['id', 'name']);
        }


        $dosenPembimbing = [];
        if (is_array($pengajuanLomba->dosen_pembimbing)) {
            $dosenPembimbing = User::whereIn('id', $pengajuanLomba->dosen_pembimbing)
                ->get(['id', 'inisial']);
        }

        return Inertia::render('Mahasiswa/DetailPengajuanLomba', [
            'pengajuanLomba' => $pengajuanLomba,
            'anggotaUser' => $anggotaUser,
            'dosenPembimbing' => $dosenPembimbing,
        ]);
    }





    public function portofolio($id)
    {
        // Cari user untuk ambil namanya
        $user = User::findOrFail($id);

        $pengajuans = PengajuanLomba::where(function ($query) use ($id) {
            // Mencari di kolom anggota_kelompok (baik sebagai string atau integer)
            $query->whereJsonContains('anggota_kelompok', (string) $id)
                ->orWhereJsonContains('anggota_kelompok', (int) $id);
        })
            // Hanya ambil pengajuan yang memiliki relasi 'prestasi' dimana statusnya 'Diterima'
            ->whereHas('prestasi', function ($query) {
                $query->where('status', 'Diterima');
            })
            // Lakukan eager loading seperti sebelumnya
            ->with(['kategori', 'prestasi'])
            ->get();

        return Inertia::render('Mahasiswa/PortofolioLomba', [
            'nama' => $user->name,
            'pengajuans' => $pengajuans
        ]);
    }
    // Tidak ada lagi parameter $id di dalam kurung
    public function portofolioMahasiswa()
    {
        // 1. Ambil data user yang sedang login
        $user = auth()->user();

        // 2. Ambil ID dari user yang login untuk digunakan di query
        $id = $user->id;

        // Query ke database tetap sama, namun sekarang $id berasal dari user yang login
        $pengajuans = PengajuanLomba::where(function ($query) use ($id) {
            // Mencari di kolom anggota_kelompok (baik sebagai string atau integer)
            $query->whereJsonContains('anggota_kelompok', (string) $id)
                ->orWhereJsonContains('anggota_kelompok', (int) $id);
        })
            // Hanya ambil pengajuan yang memiliki relasi 'prestasi' dimana statusnya 'Diterima'
            ->whereHas('prestasi', function ($query) {
                $query->where('status', 'Diterima');
            })
            // Lakukan eager loading seperti sebelumnya
            ->with(['kategori', 'prestasi'])
            ->get();

        // Kirim data ke view Inertia
        return Inertia::render('Mahasiswa/Portofolio', [
            'nama' => $user->name,
            'pengajuans' => $pengajuans
        ]);
    }




}


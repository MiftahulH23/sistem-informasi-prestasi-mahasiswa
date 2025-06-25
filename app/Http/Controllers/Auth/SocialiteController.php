<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

class SocialiteController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $socialUser = Socialite::driver('google')->user();

        // Tentukan role berdasarkan email
        $email = $socialUser->email;
        $role = 'mahasiswa'; // Default

        if ($email === 'kemahasiswaan@pcr.ac.id') {
            $role = 'Kemahasiswaan';
        } elseif (Str::endsWith($email, '@pcr.ac.id')) {
            $role = 'Dosen';
        } elseif (Str::endsWith($email, '@mahasiswa.pcr.ac.id')) {
            $role = 'Mahasiswa';
        }

        $registeredUser = User::where('google_id', $socialUser->id)
            ->orWhere('email', $email)
            ->first();


        if ($registeredUser) {
            $registeredUser->update([
                'name' => $socialUser->name,
                'email' => $email,
                'password' => Hash::make('123'),
                'google_id' => $socialUser->id,
                'google_token' => $socialUser->token,
                'google_refresh_token' => $socialUser->refreshToken,
                // 'role' => $role, // update role
            ]);

            Auth::login($registeredUser, true);
        } else {
            // Panggil API untuk mendapatkan data user
            // $mahasiswaData = url
            // $mahasiswa = array_filter($mahasiswaData, function ($item) use ($email) {
            //     return $item['email'] === $email;
            // });
            if ($role === 'Mahasiswa') {
                $check = $this->checkEmail($email);
            } elseif ($role === 'Dosen') {
                $check = $this->checkEmailDosen($email);
            } else {
                $check = null; // Untuk Kemahasiswaan, tidak perlu cek
            }

            $user = User::create([
                'name' => $check?->name ?? $socialUser->name,
                'email' => $email,
                'password' => Hash::make('123'),
                'avatar' => $socialUser->avatar,
                'google_id' => $socialUser->id,
                'google_token' => $socialUser->token,
                'google_refresh_token' => $socialUser->refreshToken,
                'role' => $role,
                'prodi' => $check?->prodi ?? null,
                'nim' => $check?->nim ?? null,
                'inisial' => $check?->inisial ?? null,
            ]);
            Auth::login($user, true);
        }

        Cookie::queue('user_session', Auth::user()->id, 120);
        return redirect()->intended('/dashboard');
    }

    public function checkEmailDosen(string $email)
    {
        $url = "https://v2.api.pcr.ac.id/api/pegawai?collection=pegawai-aktif";
        $response = Http::withHeaders([
            'apikey' => env('API_KEY_PCR'),
        ])->post($url);

        $data = $response->json();
        $check = array_filter($data['items'], function ($item) use ($email) {
            return $item['email'] === $email;
        });


        if (count($check) === 0 || $check['posisi'] !== 'Dosen') {
            return "Email tidak ditemukan.";
        }

        $dosen = reset($check);

        return (object) [
            'prodi' => $dosen['prodi'] ?? null,
            'inisial' => $dosen['inisial'] ?? null,
        ];
    }

    public static function checkEmail(string $email)
    {
        // $domain = substr(explode('@', $email)[0], -4);
        // $angkatan = substr($domain, 0, 2);
        // $prodi = substr($domain, 2, 2);

        // Ambil bagian sebelum @
        $username = explode('@', $email)[0];

        // Pakai regex ambil angkatan dan prodi
        preg_match('/(\d{2,3})([a-zA-Z]{2,4})$/', $username, $matches);

        // Cek hasil
        if (count($matches) === 3) {
            $angkatan = $matches[1]; // angka 2-3 digit
            $prodi = strtolower($matches[2]); // huruf 2-4 karakter, diubah ke lowercase
        } else {
            $angkatan = null;
            $prodi = null;
        }

        $url = "https://v2.api.pcr.ac.id/api/akademik-mahasiswa?angkatan=20{$angkatan}&prodi={$prodi}&collection=angkatan-prodi";

        $response = Http::withHeaders([
            'apikey' => env('API_KEY_PCR'),
        ])->post($url);

        $data = $response->json();
        $check = array_filter($data['items'], function ($item) use ($email) {
            return $item['email'] === $email;
        });


        if (count($check) === 0) {
            return "Email tidak ditemukan.";
        }

        $mahasiswa = reset($check);

        return (object) [
            'prodi' => $mahasiswa['prodi'] ?? null,
            'nim' => $mahasiswa['nim'] ?? null,
            'name' => $mahasiswa['nama'] ?? null,
            'email' => $mahasiswa['email'] ?? null,
        ];
    }


    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Hapus cookie login
        Cookie::queue(Cookie::forget('user_session'));

        return redirect('/');
    }
}

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
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
                'role' => $role, // update role
            ]);

            Auth::login($registeredUser, true);
        } else {
            $user = User::create([
                'name' => $socialUser->name,
                'email' => $email,
                'password' => Hash::make('123'),
                'avatar' => $socialUser->avatar,
                'google_id' => $socialUser->id,
                'google_token' => $socialUser->token,
                'google_refresh_token' => $socialUser->refreshToken,
                'role' => $role,
            ]);
            Auth::login($user, true);
        }

        Cookie::queue('user_session', Auth::user()->id, 120);
        return redirect()->intended('/dashboard');
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

<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
class SocialiteController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $socialUser = Socialite::driver('google')->user();
        // dd($socialUser);
        $registeredUser = User::where('google_id', $socialUser->id)->first();

        if ($registeredUser) {
            $registeredUser->update([
                'name' => $socialUser->name,
                'email' => $socialUser->email,
                'password' => Hash::make('123'),
                'avatar' => $socialUser->avatar,
                'google_id' => $socialUser->id,
                'google_token' => $socialUser->token,
                'google_refresh_token' => $socialUser->refreshToken,
            ]);
            Auth::login($registeredUser);
            return redirect('/dashboard');
        } else {
            $user = User::create([
                'name' => $socialUser->name,
                'email' => $socialUser->email,
                'password' => Hash::make('123'),
                'avatar' => $socialUser->avatar,
                'google_id' => $socialUser->id,
                'google_token' => $socialUser->token,
                'google_refresh_token' => $socialUser->refreshToken,
            ]);

            Auth::login($user);
            return redirect('/dashboard');
        }

        // $user->token;
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }


    // public function isStudent($email)
    // {
    //     $response = Http::get('https://api.example.com/student', [
    //         'email' => $email,
    //     ]);
    // }
}

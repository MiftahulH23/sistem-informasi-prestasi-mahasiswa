<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PengajuanLombaController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\KategoriLombaController;
use App\Http\Controllers\JudulLombaController;


Route::get('/', [AuthenticatedSessionController::class, 'create'])->middleware('guest')->name('register');

// Dashboard Controller
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');
// Pengajuan Lomba Controller
Route::get('/pengajuan-lomba', [PengajuanLombaController::class, 'create'])->middleware(['auth', 'verified'])->name('pengajuan-lomba');
Route::post('/pengajuan-lomba/store', [PengajuanLombaController::class, 'store'])->middleware(['auth', 'verified'])->name('pengajuan-lomba.store');
Route::get('/data-pengajuan-lomba', [PengajuanLombaController::class, 'index'])->middleware(['auth', 'verified'])->name('data-pengajuan-lomba');

// Kategori Lomba Controller
Route::get('/kategori-lomba',[KategoriLombaController::class, 'index'])->middleware(['auth', 'verified'])->name('kategori-lomba');
Route::post('/kategori-lomba/store', [KategoriLombaController::class, 'store'])->name('kategori-lomba.store');
Route::put('/kategori-lomba/{kategoriLomba}', [KategoriLombaController::class, 'update'])->name('kategori-lomba.update');
Route::delete('/kategori-lomba/{kategoriLomba}', [KategoriLombaController::class, 'destroy'])->name('kategori-lomba.destroy');

// Judul Lomba
Route::get('/judul-lomba', [JudulLombaController::class, 'index'])->middleware(['auth', 'verified'])->name('judul-lomba');
Route::post('/judul-lomba/store', [JudulLombaController::class, 'store'])->name('judul-lomba.store');
Route::put('/judul-lomba/{judulLomba}', [JudulLombaController::class, 'update'])->name('judul-lomba.update');
Route::delete('/judul-lomba/{judulLomba}', [JudulLombaController::class, 'destroy'])->name('judul-lomba.destroy');

Route::get('/prestasi', function () {
    return Inertia::render('Prestasi');
})->middleware(['auth', 'verified'])->name('prestasi');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/auth/redirect', [SocialiteController::class, 'redirect']);
Route::get('/auth/google/callback', [SocialiteController::class, 'callback']);
Route::post('/logout', [SocialiteController::class, 'logout'])->name('logout');

require __DIR__ . '/auth.php';

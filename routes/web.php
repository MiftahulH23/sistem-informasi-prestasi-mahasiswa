<?php

use App\Exports\PrestasiExport;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\BimbinganController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Export\PrestasiExportController;
use App\Http\Controllers\KategoriLombaController;
use App\Http\Controllers\JudulLombaController;
use App\Http\Controllers\PelaporanPrestasiController;
use App\Http\Controllers\PengajuanLombaController;
use App\Http\Controllers\PrestasiController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Controllers\SitemapController;
// Clear the cache


Route::get('/clear-cache', function() {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('route:clear');
    Artisan::call('config:cache');
    return 'Cache cleared';
});



Route::get('/generate-sitemap', [SitemapController::class, 'index']);


// Authentication Routes
Route::get('/', [AuthenticatedSessionController::class, 'create'])->middleware('guest')->name('register');
Route::get('/auth/redirect', [SocialiteController::class, 'redirect']);
Route::get('/auth/google/callback', [SocialiteController::class, 'callback']);
Route::post('/logout', [SocialiteController::class, 'logout'])->name('logout');
require __DIR__ . '/auth.php';

// Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Pengajuan Lomba
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/pengajuan-lomba/create', [PengajuanLombaController::class, 'create'])->name('pengajuan-lomba.create');
    Route::post('/pengajuan-lomba/store', [PengajuanLombaController::class, 'store'])->name('pengajuan-lomba.store');
    Route::get('/pengajuan-lomba', [PengajuanLombaController::class, 'index'])->name('pengajuan-lomba.index');
    Route::get('/pengajuan-lomba/update', [PengajuanLombaController::class, 'editStatus'])->name('update-pengajuan-lomba');
    Route::put('/pengajuan-lomba/{id}/update-status', [PengajuanLombaController::class, 'updateStatus'])->name('pengajuan-lomba.update-status');
    Route::get('/pengajuan-lomba/show/{id}', [PengajuanLombaController::class, 'show'])->name('pengajuan-lomba.show');
    Route::get('/pengajuan-lomba/update/show/{id}', [PengajuanLombaController::class, 'show'])->name('pengajuan-lomba.show');
    Route::get('/pengajuan-lomba/update/portofolio/{id}', [PengajuanLombaController::class, 'portofolio']);

});

// Kategori Lomba
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/kategori-lomba', [KategoriLombaController::class, 'index'])->name('kategori-lomba');
    Route::post('/kategori-lomba/store', [KategoriLombaController::class, 'store'])->name('kategori-lomba.store');
    Route::put('/kategori-lomba/{kategoriLomba}', [KategoriLombaController::class, 'update'])->name('kategori-lomba.update');
    Route::delete('/kategori-lomba/{kategoriLomba}', [KategoriLombaController::class, 'destroy'])->name('kategori-lomba.destroy');
});

// Judul Lomba
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/judul-lomba', [JudulLombaController::class, 'index'])->name('judul-lomba');
    Route::post('/judul-lomba/store', [JudulLombaController::class, 'store'])->name('judul-lomba.store');
    Route::put('/judul-lomba/{judulLomba}', [JudulLombaController::class, 'update'])->name('judul-lomba.update');
    Route::delete('/judul-lomba/{judulLomba}', [JudulLombaController::class, 'destroy'])->name('judul-lomba.destroy');
});

// Pelaporan Prestasi
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/pelaporan-prestasi', [PelaporanPrestasiController::class, 'index'])->name('pelaporan-prestasi');
    Route::get('/pelaporan-prestasi/create', [PelaporanPrestasiController::class, 'create'])->name('pelaporan-prestasi.create');
    Route::post('/pelaporan-prestasi/store', [PelaporanPrestasiController::class, 'store'])->name('pelaporan-prestasi.store');
    Route::get('/pelaporan-prestasi/update', [PelaporanPrestasiController::class, 'editStatus'])->name('update-pelaporan-prestasi');
    Route::put('/pelaporan-prestasi/{id}/update-status', [PelaporanPrestasiController::class, 'updateStatus'])->name('pelaporan-prestasi.update-status');
});

// Prestasi
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/prestasi', [PrestasiController::class, 'index'])->name('prestasi.index');
});

// Bimbingan
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/bimbingan', [BimbinganController::class, 'index'])->name('bimbingan.index');
    Route::get('/bimbingan/pengajuan-lomba/show/{id}', [PengajuanLombaController::class, 'show']);
    Route::get('/bimbingan/{id}', [BimbinganController::class, 'show']);
    Route::get('/bimbingan/{pengajuanlomba}/create', [BimbinganController::class, 'create']);
    Route::post('/bimbingan/{pengajuanlomba}', [BimbinganController::class, 'store']);
    Route::get('/bimbingan-dosen', [BimbinganController::class, 'indexDosen'])->name('bimbingan.indexDosen');
    Route::get('/bimbingan-dosen/pengajuan-lomba/show/{id}', [PengajuanLombaController::class, 'show']);
    Route::get('/bimbingan-dosen/{id}', [BimbinganController::class, 'showForDosen']);
    Route::put('/bimbingan-dosen/{id}/update-status', [BimbinganController::class, 'update']);
});

// Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Export
Route::get('/export-prestasi', [PrestasiExportController::class, 'export']);


// Notifikasi
Route::get('/notify', [PengajuanLombaController::class, 'notify'])->name('pengajuan-notif');
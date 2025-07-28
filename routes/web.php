<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\Auth\{
    AuthenticatedSessionController,
    SocialiteController
};
use App\Http\Controllers\{
    DashboardController,
    SitemapController,
    KategoriLombaController,
    JudulLombaController,
    PengajuanLombaController,
    PelaporanPrestasiController,
    PrestasiController,
    BimbinganController,
    ProfileController
};
use App\Http\Controllers\Export\PrestasiExportController;
use Inertia\Inertia;

// Utility
Route::get('/clear-cache', function () {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('route:clear');
    Artisan::call('config:cache');
    return 'Cache cleared';
});
Route::fallback(function () {
        return Inertia::render('NotFound');
    })->name('not-found');
Route::get('/generate-sitemap', [SitemapController::class, 'index']);

// Auth
Route::middleware('guest')->group(function () {
    Route::get('/', [AuthenticatedSessionController::class, 'create'])->name('register');
});

Route::get('/auth/redirect', [SocialiteController::class, 'redirect']);
Route::get('/auth/google/callback', [SocialiteController::class, 'callback']);
Route::post('/logout', [SocialiteController::class, 'logout'])->name('logout');
require __DIR__ . '/auth.php';

// Dashboard (shared by all authenticated users)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/prestasi', [PrestasiController::class, 'index'])->name('prestasi.index');
    Route::get('/export-prestasi', [PrestasiExportController::class, 'export']);
});

// Profile
Route::middleware('auth')->prefix('profile')->name('profile.')->group(function () {
    Route::get('/', [ProfileController::class, 'edit'])->name('edit');
    Route::patch('/', [ProfileController::class, 'update'])->name('update');
    Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
});

// Notifikasi
Route::get('/notify', [PengajuanLombaController::class, 'notify'])->name('pengajuan-notif');

Route::get('/kirim-email', [PengajuanLombaController::class, 'kirimEmail'])->name('kirim-email');

// =======================
// Kemahasiswaan
// =======================
Route::middleware(['auth', 'verified', 'role:Kemahasiswaan'])->group(function () {
    // Kategori Lomba
    Route::prefix('kategori-lomba')->name('kategori-lomba.')->controller(KategoriLombaController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/store', 'store')->name('store');
        Route::put('/{kategoriLomba}', 'update')->name('update');
        Route::delete('/{kategoriLomba}', 'destroy')->name('destroy');
    });

    // Judul Lomba
    Route::prefix('judul-lomba')->name('judul-lomba.')->controller(JudulLombaController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/store', 'store')->name('store');
        Route::put('/{judulLomba}', 'update')->name('update');
        Route::delete('/{judulLomba}', 'destroy')->name('destroy');
    });

    // Pengajuan Lomba
    Route::prefix('pengajuan-lomba')->controller(PengajuanLombaController::class)->group(function () {
        Route::get('/update', 'editStatus')->name('update-pengajuan-lomba');
        Route::put('/{id}/update-status', 'updateStatus')->name('pengajuan-lomba.update-status');
        Route::get('/update/show/{id}', 'show')->name('pengajuan-lomba.show');
        Route::get('/update/portofolio/{id}', 'portofolio');
    });

    // Pelaporan Prestasi
    Route::prefix('pelaporan-prestasi')->controller(PelaporanPrestasiController::class)->group(function () {
        Route::get('/update', 'editStatus')->name('update-pelaporan-prestasi');
        Route::put('/{id}/update-status', 'updateStatus')->name('pelaporan-prestasi.update-status');
    });
});

// =======================
// Mahasiswa
// =======================
Route::middleware(['auth', 'verified', 'role:Mahasiswa'])->group(function () {
    // Pengajuan Lomba
    Route::prefix('pengajuan-lomba')->controller(PengajuanLombaController::class)->group(function () {
        Route::get('/', 'index')->name('pengajuan-lomba.index');
        Route::get('/create', 'create')->name('pengajuan-lomba.create');
        Route::post('/store', 'store')->name('pengajuan-lomba.store');
        Route::get('/show/{id}', 'show')->name('pengajuan-lomba.show');
    });
    Route::get('/portofolio', [PengajuanLombaController::class, 'portofolioMahasiswa'])->name('portofolio.mahasiswa');

    // Pelaporan Prestasi
    Route::prefix('pelaporan-prestasi')->controller(PelaporanPrestasiController::class)->group(function () {
        Route::get('/', 'index')->name('pelaporan-prestasi');
        Route::get('/create', 'create')->name('pelaporan-prestasi.create');
        Route::post('/store', 'store')->name('pelaporan-prestasi.store');
    });

    // Bimbingan
    Route::prefix('bimbingan')->controller(BimbinganController::class)->group(function () {
        Route::get('/', 'index')->name('bimbingan.index');
        Route::get('/{id}', 'show');
        Route::get('/{pengajuanlomba}/create', 'create');
        Route::post('/{pengajuanlomba}', 'store');
        Route::get('/pengajuan-lomba/show/{id}', [PengajuanLombaController::class, 'show']);
    });
});

// =======================
// Dosen
// =======================
Route::middleware(['auth', 'verified', 'role:Dosen'])->prefix('bimbingan-dosen')->name('bimbingan.')->group(function () {
    Route::controller(BimbinganController::class)->group(function () {
        Route::get('/', 'indexDosen')->name('indexDosen');
        Route::get('/{id}', 'showForDosen');
        Route::put('/{id}/update-status', 'update');
    });

    Route::get('/pengajuan-lomba/show/{id}', [PengajuanLombaController::class, 'show']);
});

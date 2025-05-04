<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Artisan;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (env('APP_ENV') !== 'local') {
            URL::forceScheme('https');
        }
        Vite::prefetch(concurrency: 3);

        if (app()->environment('production')) {
            // Cek dan buat symbolic link jika belum ada
            $publicStorage = public_path('storage');
            if (!is_link($publicStorage)) {
                Artisan::call('storage:link');
            }
        }
    }
}

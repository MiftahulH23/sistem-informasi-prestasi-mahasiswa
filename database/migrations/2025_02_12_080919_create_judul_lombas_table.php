<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('judul_lomba', function (Blueprint $table) {
            $table->uuid('judullomba_id')->primary();
            $table->string('judul_lomba');
            $table->uuid('kategorilomba_id');
            $table->timestamps();
            $table->softDeletes();
             // Foreign key dengan UUID
             $table->foreign('kategorilomba_id')->references('kategorilomba_id')->on('kategori_lomba');
        });
    }
    public function down(): void {
        Schema::dropIfExists('judul_lomba');
    }
};

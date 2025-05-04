<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('prestasi', function (Blueprint $table) {
            $table->uuid('prestasi_id')->primary();
            $table->uuid('pengajuanlomba_id'); // Gunakan UUID
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Tetap pakai foreignId karena users pakai bigint
            $table->string('capaian_prestasi');
            $table->string('sertifikat')->nullable(); // File sertifikat (PDF)
            $table->string('surat_tugas')->nullable(); 
            $table->json('dokumentasi')->nullable(); // Untuk menyimpan hingga 3 foto
            $table->string('url_media_sosial');
            $table->string('status');
            $table->string('catatan')->nullable(); 
            $table->softDeletes();
            $table->timestamps();

            // Set Foreign Key ke pengajuan_lomba (harus pakai UUID)
            $table->foreign('pengajuanlomba_id')->references('pengajuanlomba_id')->on('pengajuan_lomba')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prestasi');
    }
};

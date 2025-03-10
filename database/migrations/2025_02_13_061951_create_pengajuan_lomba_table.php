<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pengajuan_lomba', function (Blueprint $table) {
            $table->uuid('pengajuanlomba_id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->uuid('kategorilomba_id');
            $table->string('judul_lomba');
            $table->string('jenis_lomba');
            $table->string('tingkat_lomba');
            $table->string('program_studi');
            $table->string('model_pelaksanaan');
            $table->string('dosen_pembimbing');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->string('jenis_kepesertaan');
            $table->string('status');
            $table->integer('jumlah_peserta');
            $table->json('anggota_kelompok')->nullable();
            $table->string('surat_tugas');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('kategorilomba_id')->references('kategorilomba_id')->on('kategori_lomba')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_lomba');
    }
};

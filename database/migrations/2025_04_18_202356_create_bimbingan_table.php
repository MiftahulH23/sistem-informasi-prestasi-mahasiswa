<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bimbingan', function (Blueprint $table) {
            $table->uuid('bimbingan_id')->primary(); // UUID sebagai primary key
            $table->uuid('pengajuanlomba_id'); // FK ke pengajuan lomba
            $table->date('tanggal');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->text('materi_bimbingan');
            $table->text('catatan_bimbingan')->nullable();
            $table->string('status');

            $table->timestamps();

            // Foreign key constraint
            $table->foreign('pengajuanlomba_id')
                ->references('pengajuanlomba_id')
                ->on('pengajuan_lomba')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bimbingan');
    }
};

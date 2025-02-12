<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('judul_lomba', function (Blueprint $table) {
            $table->id();
            $table->string('judul_lomba');
            $table->foreignId('kategori_lomba_id')->constrained('kategori_lomba')->onDelete('cascade');
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('judul_lomba');
    }
};

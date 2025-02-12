<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class JudulLomba extends Model
{
    use HasFactory;
    protected $table = 'judul_lomba';
    protected $fillable = ['judul_lomba', 'kategori_lomba_id'];
    public function kategori() {
        return $this->belongsTo(KategoriLomba::class, 'kategori_lomba_id');
    }
}

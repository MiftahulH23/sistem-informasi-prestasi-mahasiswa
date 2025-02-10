<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengajuanLomba extends Model
{
    use HasFactory;
    protected $table = 'pengajuan_lomba';
    protected $fillable = [
        'user_id',
        'kategori_lomba',
        'judul_lomba',
        'jenis_lomba',
        'tingkat_lomba',
        'model_pelaksanaan',
        'dosen_pembimbing',
        'tanggal_mulai',
        'tanggal_selesai',
        'jenis_kepesertaan',
        'jumlah_peserta',
        'anggota_kelompok',
        'surat_tugas',
        'status',
    ];

    protected $casts = [
        'anggota_kelompok' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

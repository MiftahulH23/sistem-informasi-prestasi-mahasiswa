<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Notifications\Notifiable;
class PengajuanLomba extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'pengajuan_lomba';
    protected $primaryKey = 'pengajuanlomba_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'kategorilomba_id',
        'judul_lomba',
        'jenis_lomba',
        'tingkat_lomba',
        'model_pelaksanaan',
        'program_studi',
        'dosen_pembimbing',
        'tanggal_mulai',
        'tanggal_selesai',
        'jenis_kepesertaan',
        'jumlah_peserta',
        'anggota_kelompok',
        'surat_tugas',
        'status',
    ];
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->pengajuanlomba_id = (string) Str::uuid(); // Generate UUID otomatis
        });
        static::addGlobalScope('orderByCreatedAt', function ($query) {
            $query->orderBy('created_at', 'desc');
        });
    }

    protected $casts = [
        'anggota_kelompok' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function kategori()
    {
        return $this->belongsTo(KategoriLomba::class, 'kategorilomba_id');
    }


}

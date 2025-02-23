<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
class Prestasi extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'prestasi';
    protected $primaryKey = 'prestasi_id';
    public $incrementing = false; // Karena pakai UUID
    protected $keyType = 'string'; // UUID adalah string

    protected $fillable = [
        'pengajuanlomba_id',
        'user_id',
        'capaian_prestasi',
        'sertifikat',
        'dokumentasi',
        'surat_tugas',
        'url_media_sosial',
        'status'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->prestasi_id = (string) Str::uuid(); // Generate UUID otomatis
        });
    }

    protected $casts = [
        'dokumentasi' => 'array', // Agar bisa menyimpan foto dalam bentuk JSON
    ];

    public function pengajuanLomba()
    {
        return $this->belongsTo(PengajuanLomba::class, 'pengajuanlomba_id', 'pengajuanlomba_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

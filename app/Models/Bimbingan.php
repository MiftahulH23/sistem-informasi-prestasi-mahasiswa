<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Bimbingan extends Model
{
    use HasFactory;
    protected $table = 'bimbingan';
    protected $primaryKey = 'bimbingan_id';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'bimbingan_id',
        'pengajuanlomba_id',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'materi_bimbingan',
        'catatan_bimbingan',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->bimbingan_id = (string) Str::uuid();
        });
    }

    public function pengajuanLomba()
    {
        return $this->belongsTo(PengajuanLomba::class, 'pengajuanlomba_id');
    }
}

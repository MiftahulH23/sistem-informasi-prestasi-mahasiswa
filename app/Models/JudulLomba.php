<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\SoftDeletes;
class JudulLomba extends Model
{
    use HasFactory;
    use SoftDeletes;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $table = 'judul_lomba';
    protected $primaryKey = 'judullomba_id';
    protected $fillable = ['judul_lomba', 'kategorilomba_id'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->judullomba_id = (string) Str::uuid(); // Generate UUID otomatis
        });
    }


    public function kategori() {
        return $this->belongsTo(KategoriLomba::class, 'kategorilomba_id');
    }
}

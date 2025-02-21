<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
class KategoriLomba extends Model
{
    use HasFactory;
    use SoftDeletes;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $primaryKey = 'kategorilomba_id';
    protected $table = 'kategori_lomba';
    protected $fillable = ['kategori_lomba'];
    public $timestamps = true;
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            $model->kategorilomba_id = (string) Str::uuid(); // Generate UUID otomatis
        });
    }
    public function judulLomba()
    {
        return $this->hasMany(JudulLomba::class, 'kategorilomba_id', 'kategorilomba_id');
    }
}

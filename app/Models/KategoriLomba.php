<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
class KategoriLomba extends BaseModel
{
    use HasFactory;
    protected $primaryKey = 'kategorilomba_id';
    protected $table = 'kategori_lomba';
    protected $fillable = ['kategori_lomba'];
    public function judulLomba()
    {
        return $this->hasMany(JudulLomba::class, 'kategorilomba_id', 'kategorilomba_id');
    }
}

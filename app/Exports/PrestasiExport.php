<?php
namespace App\Exports;

use App\Models\Prestasi;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PrestasiExport implements FromCollection, WithHeadings
{
    protected $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = Prestasi::with(['pengajuanLomba.kategori']);

        if ($this->request->filled('capaian_prestasi')) {
            $query->whereIn('capaian_prestasi', (array) $this->request->input('capaian_prestasi'));
        }

        if ($this->request->filled('tingkat_lomba')) {
            $query->whereHas('pengajuanLomba', function ($q) {
                $q->whereIn('tingkat_lomba', (array) $this->request->input('tingkat_lomba'));
            });
        }
        if ($this->request->filled('program_studi')) {
            $query->whereHas('pengajuanLomba', function ($q) {
                $q->whereIn('program_studi', (array) $this->request->input('program_studi'));
            });
        }

        if ($this->request->filled('jenis_lomba')) {
            $query->whereHas('pengajuanLomba', function ($q) {
                $q->whereIn('jenis_lomba', (array) $this->request->input('jenis_lomba'));
            });
        }

        if ($this->request->filled('kategori_lomba')) {
            $query->whereHas('pengajuanLomba.kategori', function ($q) {
                $q->whereIn('kategori_lomba', (array) $this->request->input('kategori_lomba'));
            });
        }

        if ($this->request->filled('tahun')) {
            $query->whereYear('pengajuan_lomba.tanggal_mulai', $this->request->input('tahun'));
        }

        $data = $query->get();

        return $data->map(function ($item, $index) {
            return [
                'No' => $index + 1,
                'Judul Lomba' => $item->pengajuanLomba->judul_lomba,
                'Capaian Prestasi' => $item->capaian_prestasi,
                'Tingkat Lomba' => $item->pengajuanLomba->tingkat_lomba,
                'Program Studi' => $item->pengajuanLomba->program_studi,
                'Kategori' => $item->pengajuanLomba->kategori->kategori_lomba ?? '-',
                'Jenis Lomba' => $item->pengajuanLomba->jenis_lomba,
                'Tanggal Mulai' => $item->pengajuanLomba->tanggal_mulai,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Judul Lomba',
            'Capaian Prestasi',
            'Tingkat Lomba',
            'Program Studi',
            'Kategori',
            'Jenis Lomba',
            'Tanggal Mulai',
        ];
    }
}


<?php

namespace App\Http\Controllers\Export;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Exports\PrestasiExport;
use Maatwebsite\Excel\Facades\Excel;

class PrestasiExportController extends Controller
{
    public function export(Request $request)
    {
        return Excel::download(new PrestasiExport($request), 'prestasi.xlsx');
    }
}


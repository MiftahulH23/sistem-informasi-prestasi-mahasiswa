import {
    DataTable,
    DataTableControls,
    DataTableFilter,
} from "@/Components/DataTable";
import { Filter } from "@/Components/Filter";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { format, getDate } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const Prestasi = ({data}) => {
    const columns = [
        {
            id: "Nomor",
            header: (row, index) => {
                return <div id="nomor">No</div>;
            },
            cell: (info) => info.row.index + 1,
        },
        {
            accessorKey: "pengajuan_lomba.judul_lomba",
            header: "Judul Lomba",
        },
        {
            accessorKey: "capaian_prestasi",
            header: "Pembimbing",
        },
        {
            accessorKey: "pengajuan_lomba.tingkat_lomba",
            header: "Tingkat Lomba",
        },
        {
            accessorKey: "pengajuan_lomba.kategori.kategori_lomba",  // Akses nama kategori
            header: "Kategori",
        },
        {
            accessorKey: "pengajuan_lomba.jenis_lomba",
            header: "Jenis Lomba",
            filterFn: Filter.dataTable("checkbox"),
        },
    ];
    const statusPengajuan = ["Diajukan", "Diterima", "Ditolak"];
    const tingkatLomba = [
        "Internasional",
        "Nasional",
        "Provinsi",
        "Lokal-Wilayah",
    ];
    const jenisLomba = ["Akademik", "Non-Akademik"];
    return (
        <AuthenticatedLayout>
            <Head title="Data Pengajuan Lomba" />
            <h1>Data Pengajuan Lomba</h1>
            <div className="overflow-x-auto p-4">
                <DataTable columns={columns} data={data}>
                    {({ table }) => {
                        return (
                            <DataTableControls table={table}>
                            </DataTableControls>
                        );
                    }}
                </DataTable>
            </div>
        </AuthenticatedLayout>
    );
};

export default Prestasi;


import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import { customFilterFns } from "@/Components/data-table/utils";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

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
            filterFn: customFilterFns["checkbox"],
        },
        {
            id: "tingkat_lomba",
            accessorKey: "pengajuan_lomba.tingkat_lomba",
            header: "Tingkat Lomba",
            filterFn: customFilterFns["checkbox"],
        },
        {
            id: "kategori_lomba",
            accessorKey: "pengajuan_lomba.kategori.kategori_lomba",  // Akses nama kategori
            header: "Kategori",
            filterFn: customFilterFns["checkbox"],
        },
        {
            id: "jenis_lomba",
            accessorKey: "pengajuan_lomba.jenis_lomba",
            header: "Jenis Lomba",
            filterFn: customFilterFns["checkbox"],
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
    const capaianPrestasi = ["Juara 1", "Juara 2", "Juara 3", "Harapan 1", "Harapan 2", "Harapan 3"];
    return (
        <AuthenticatedLayout>
            <Head title="Data Pengajuan Lomba" />
            <h1>Data Pengajuan Lomba</h1>
            <div className="overflow-x-auto p-4">
                <DataTable columns={columns} data={data}>
                    {({ table }) => {
                        return (
                            <DataTableControls table={table}>
                                <DataTableFilter table={table} extend={[
                                    {
                                        id: "capaian_prestasi",
                                        label: "Capaian Prestasi",
                                        data: capaianPrestasi,
                                    },
                                    {
                                        id: "tingkat_lomba",
                                        label: "Tingkat Lomba",
                                        data: tingkatLomba,
                                    },
                                    {
                                        id: "jenis_lomba",
                                        label: "Jenis Lomba",
                                        data: jenisLomba,
                                    },
                                    {
                                        id: "kategori_lomba",
                                        label: "Kategori Lomba",
                                    },
                                    ]} />
                            </DataTableControls>
                        );
                    }}
                </DataTable>
            </div>
        </AuthenticatedLayout>
    );
};

export default Prestasi;

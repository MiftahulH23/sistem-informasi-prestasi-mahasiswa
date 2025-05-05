import { DataTable, DataTableControls } from "@/Components/data-table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

const Bimbingan = ({ pengajuanLomba }) => {
    const DetailPengajuanLomba = (id) => {
        router.get(`/bimbingan/pengajuan-lomba/show/${id}`);
    };
    const columns = [
        {
            id: "Nomor",
            header: (row, index) => {
                return <div id="nomor">No</div>;
            },
            cell: (info) => info.row.index + 1,
        },
        {
            id: "judul_lomba",
            accessorKey: "judul_lomba",
            header: "Judul Lomba",
        },
        {
            id: "tingkat_lomba",
            accessorKey: "tingkat_lomba",
            header: "Tingkat Lomba",
        },
        {
            id: "dosen_pembimbing",
            accessorKey: "dosen.name",
            header: "Pembimbing",
        },
        {
            id: "bimbingan",
            header: "Bimbingan",
            cell: ({ row }) => {
                const id = row.original.pengajuanlomba_id;
                return (
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => router.get(`/bimbingan/${id}`)}
                            className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition"
                        >
                            Lihat Bimbingan
                        </button>
                    </div>
                );
            },
        },
    ];
    const breadcrumb = [{
        title: "Bimbingan",
        href: "/bimbingan",
    }]
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Bimbingan" />
            <h1 className="text-2xl font-bold mb-4">Bimbingan</h1>
            <DataTable columns={columns} data={pengajuanLomba}>
                {({ table }) => {
                    return (
                        <DataTableControls table={table}></DataTableControls>
                    );
                }}
            </DataTable>
        </AuthenticatedLayout>
    );
};

export default Bimbingan;

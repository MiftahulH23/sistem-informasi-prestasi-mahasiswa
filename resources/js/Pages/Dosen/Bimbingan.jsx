import { DataTable, DataTableControls } from "@/Components/data-table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

const Bimbingan = ({ pengajuanLomba }) => {
    const DetailPengajuanLomba = (id) => {
        router.get(`/bimbingan-dosen/pengajuan-lomba/show/${id}`);
    };
    console.log(pengajuanLomba);
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
            id: "ketua_tim",
            accessorKey: "nama_ketua_tim",
            header: "Ketua Tim",
        },  
        {
            id: "bimbingan",
            header: "Bimbingan",
            cell: ({ row }) => {
                const id = row.original.pengajuanlomba_id;
                return (
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => router.get(`/bimbingan-dosen/${id}`)}
                            className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition hover:cursor-pointer"
                        >
                            Detail
                        </button>
                    </div>
                );
            },
        },
    ];
    const breadcrumb = [
        {
            title: "Bimbingan",
            href: "/bimbingan-dosen",
        }
    ]
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Bimbingan" />
            <h1 className="text-2xl font-bold mb-4">Bimbingan</h1>
            <DataTable columns={columns} data={pengajuanLomba}>
                {({ table }) => {
                    return (
                        <DataTableControls table={table}>
                            
                        </DataTableControls>
                    );
                }}
            </DataTable>
        </AuthenticatedLayout>
    );
};

export default Bimbingan;

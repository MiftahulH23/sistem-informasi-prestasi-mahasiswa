import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { id } from "date-fns/locale";
import React from "react";

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
            accessorKey: "dosen_pembimbing",
            header: "Pembimbing",
        },
        {
            accessorKey: "Detail",
            header: "Detail",
            cell: ({ row }) => {
                const id = row.original.pengajuanlomba_id;
                return (
                    <div className="flex gap-2 items-center justify-center">
                        <button
                            onClick={() => DetailPengajuanLomba(id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 transition"
                        >
                            Detail
                        </button>
                    </div>
                );
            },
        },
        {
            id: "bimbingan",
            header: "Bimbingan",
            cell: ({ row }) => {
                const id = row.original.pengajuanlomba_id;
                return (
                    <div className="flex gap-2 items-center justify-center">
                        <button
                            onClick={() => router.get(`/bimbingan/${id}`)}
                            className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition"
                        >
                            Lihat Bimbingan
                        </button>
                    </div>
                );
            }
        }
        
    ];
    return (
        <AuthenticatedLayout>
            <Head title="Bimbingan" />
            <h1 className="text-2xl font-bold mb-4">Bimbingan</h1>
            <div className="overflow-x-auto p-4">
                <DataTable columns={columns} data={pengajuanLomba}>
                    {({ table }) => {
                        return (
                            <DataTableControls
                                table={table}
                            ></DataTableControls>
                        );
                    }}
                </DataTable>
            </div>
        </AuthenticatedLayout>
    );
};

export default Bimbingan;

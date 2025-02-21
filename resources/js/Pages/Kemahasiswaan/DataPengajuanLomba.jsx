import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import TableComponent from "@/Components/TableComponent";
import { customFilterFn, DataTable } from "@/Components/DataTable";

const DataPengajuanLomba = ({ pengajuanLomba }) => {
    const [reviewed, setReviewed] = useState(
        pengajuanLomba.reduce((acc, lomba) => {
            acc[lomba.id] = lomba.status !== "Diajukan";
            return acc;
        }, {})
    );

    const updateStatus = (id, status) => {
        router.put(`/pengajuan-lomba/${id}/update-status`, { status });
        Swal.fire("Berhasil!", "Status pengajuan berhasil diubah.", "success");
        setReviewed((prev) => ({ ...prev, [id]: true }));
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
            accessorKey: "judul_lomba",
            header: "Judul Lomba",
        },
        {
            accessorFn: (row) => row.kategori.kategori_lomba,
            cell: ({ row }) => {
                const kategori = row.original.kategori.kategori_lomba;
                return kategori;
            },
            header: "Kategori Lomba",
            filterFn: customFilterFn
        },
        {
            accessorKey: "tanggal_mulai",
            header: "Tanggal Mulai",
        },
        {
            accessorKey: "tanggal_selesai",
            header: "Tanggal Selesai",
        },
        {
            accessorKey: "status",
            header: "Status",
            filterFn: customFilterFn
        },
        {
            id: "Aksi",
            header: "Aksi",
            cell: ({ row }) => {
                const id = row.original.pengajuanlomba_id;
                return reviewed[id] ? (
                    <span className="text-gray-500">Sudah Direview</span>
                ) : (
                    <div className="flex gap-2 items-center justify-center">
                        <button
                            onClick={() => updateStatus(id, "Diterima")}
                            className="bg-blue-500 text-white px-1 rounded size-5"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-check w-full h-full object-cover"
                            >
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        </button>
                        <button
                            onClick={() => updateStatus(id, "Ditolak")}
                            className="bg-red-500 text-white px-1 rounded size-5"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-x w-full h-full object-cover"
                            >
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>
                );
            },
        },
    ];

    const filter = [
        {
            title: "status",
            data: pengajuanLomba
                ? [...new Set(pengajuanLomba.map(lomba => lomba.status || "Tidak diketahui"))]
                : []
        },
        {
            title: "kategori",
            data: pengajuanLomba
                ? [...new Set(pengajuanLomba.map(lomba => lomba.kategori?.kategori_lomba || "Tidak ada kategori"))]
                : []
        }
    ];
    

    return (
        <AuthenticatedLayout>
            <Head title="Data Pengajuan Lomba" />
            <div className="overflow-x-auto p-4">
                <DataTable columns={columns} data={pengajuanLomba} filtering={filter} />
            </div>
        </AuthenticatedLayout>
    );
};

export default DataPengajuanLomba;

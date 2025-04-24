import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import { customFilterFns } from "@/Components/data-table/utils";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
const DataBimbingan = ({ bimbingan, judul_lomba }) => {
    const { props } = usePage();
    const id = props.id;
    const [reviewed, setReviewed] = useState(
        bimbingan.reduce((acc, item) => {
            acc[item.bimbingan_id] = item.status !== "Diajukan"; // Jika bukan "Diajukan", maka sudah direview
            return acc;
        }, {})
    );
    const updateStatus = (id, status) => {
        router.put(
            `/bimbingan-dosen/${id}/update-status`,
            { status },
            {
                onSuccess: () => {
                    setReviewed((prev) => ({ ...prev, [id]: true })); // Tandai sebagai sudah direview
                    Swal.fire(
                        "Berhasil!",
                        "Status bimbingan berhasil diubah.",
                        "success"
                    );
                },
                onError: () => {
                    Swal.fire(
                        "Gagal!",
                        "Terjadi kesalahan, coba lagi nanti.",
                        "error"
                    );
                },
            }
        );
    };
    const columns = [
        {
            id: "Nomor",
            header: "No",
            cell: (info) => info.row.index + 1,
        },
        {
            id: "tanggal",
            accessorKey: "tanggal",
            header: "Tanggal",
        },
        {
            id: "materi_bimbingan",
            accessorKey: "materi_bimbingan",
            header: "Materi Bimbingan",
        },
        {
            id: "catatan_bimbingan",
            accessorKey: "catatan_bimbingan",
            header: "Catatan Bimbingan",
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <div
                        className={`${
                            status === "Diterima"
                                ? "text-green-500"
                                : status === "Diajukan"
                                ? "text-blue-500"
                                : "text-red-500"
                        } font-semibold`}
                    >
                        {status}
                    </div>
                );
            },
            filterFn: "checkbox",
        },
        {
            id: "Aksi",
            header: "Aksi",
            cell: ({ row }) => {
                const id = row.original.bimbingan_id;
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
    const Status = ["Diajukan", "Diterima", "Ditolak"];
    return (
        <AuthenticatedLayout>
            <Head title="Data Bimbingan" />
            <h1>Data Bimbingan - {judul_lomba}</h1>
            <DataTable columns={columns} data={bimbingan}>
                {({ table }) => {
                    return (
                        <DataTableControls table={table}>
                            <DataTableFilter
                                table={table}
                                extend={[
                                    {
                                        id: "status",
                                        label: "Status",
                                        data: Status,
                                    },
                                ]}
                            />
                            <button
                                onClick={() =>
                                    router.get(`/bimbingan/${id}/create`)
                                }
                                className="bg-blue-600 py-2 px-4 text-white rounded-md ms-auto"
                            >
                                Tambah
                            </button>
                        </DataTableControls>
                    );
                }}
            </DataTable>
        </AuthenticatedLayout>
    );
};

export default DataBimbingan;

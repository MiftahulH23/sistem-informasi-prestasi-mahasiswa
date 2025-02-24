import {
    customDataFilter,
    DataTable,
    DataTableControls,
    DataTableFilter,
} from "@/Components/DataTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import { id, id as idLocale } from "date-fns/locale";
import { format, getDate } from "date-fns";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

const DataPengajuanLomba = ({ pengajuanLomba, kategoriLomba }) => {
    const [reviewed, setReviewed] = useState(
        pengajuanLomba.reduce((acc, lomba) => {
            acc[lomba.pengajuanlomba_id] = lomba.status !== "Diajukan";
            return acc;
        }, {})
    );

    const updateStatus = (id, status) => {
        router.put(`/pengajuan-lomba/${id}/update-status`, { status });
        Swal.fire("Berhasil!", "Status pengajuan berhasil diubah.", "success");
        setReviewed((prev) => ({ ...prev, [id]: true }));
    };
    const DetailPengajuanLomba = (id) => {
        router.get(`/data-pengajuan-lomba/show/${id}`);
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
            id: "kategorilomba_id",
            accessorFn: (row) => {
                return row.kategori.kategori_lomba;
            },
            cell: ({ row }) => {
                const kategori = row.original.kategori.kategori_lomba;
                return row.getValue("kategorilomba_id");
            },
            header: "Kategori Lomba",
            filterFn: customDataFilter(),
        },
        {
            id: "tingkat_lomba",
            accessorKey: "tingkat_lomba",
            header: "Tingkat Lomba",
            filterFn: customDataFilter(),
        },
        {
            accessorKey: "dosen_pembimbing",
            header: "Pembimbing",
        },
        {
            accessorKey: "tanggal_mulai",
            header: "Tanggal Mulai",
            cell: ({ row: { original: data } }) => {
                const dateOpt = {
                    locale: idLocale,
                    weekStartsOn: 1,
                };

                const date = getDate(data.tanggal_mulai, dateOpt);
                const month = format(data.tanggal_mulai, "LLL", dateOpt);
                const fullDate = format(data.tanggal_mulai, "PPPP", dateOpt);

                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="m-auto bg-card flex size-9 cursor-default flex-col items-center justify-center rounded-md border text-center">
                                <span className="text-xs font-semibold leading-snug">
                                    {date}
                                </span>
                                <span className="text-muted-foreground text-xs leading-none">
                                    {month}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="shadow-md">{`${fullDate}`}</TooltipContent>
                    </Tooltip>
                );
            },
        },
        {
            accessorKey: "tanggal_selesai",
            header: "Tanggal Selesai",
            cell: ({ row: { original: data } }) => {
                const dateOpt = {
                    locale: idLocale,
                    weekStartsOn: 1,
                };

                const date = getDate(data.tanggal_selesai, dateOpt);
                const month = format(data.tanggal_selesai, "LLL", dateOpt);
                const fullDate = format(data.tanggal_selesai, "PPPP", dateOpt);

                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="m-auto bg-card flex size-9 cursor-default flex-col items-center justify-center rounded-md border text-center">
                                <span className="text-xs font-semibold leading-snug">
                                    {date}
                                </span>
                                <span className="text-muted-foreground text-xs leading-none">
                                    {month}
                                </span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="shadow-md">{`${fullDate}`}</TooltipContent>
                    </Tooltip>
                );
            },
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
            filterFn: customDataFilter(),
        },
        {
            accessorKey: "porfolio",
            header: "Portfolio",
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

    const statusPengajuan = ["Diajukan", "Diterima", "Ditolak"];
    return (
        <AuthenticatedLayout>
            <Head title="Data Pengajuan Lomba" />
            <div className="overflow-x-auto p-4">
                <DataTable columns={columns} data={pengajuanLomba}>
                    {({ table }) => {
                        return (
                            <DataTableControls table={table}>
                                <DataTableFilter
                                    table={table}
                                    filter="status"
                                    data={statusPengajuan}
                                />
                                <DataTableFilter
                                    table={table}
                                    filter="kategorilomba_id"
                                    data={kategoriLomba.map(
                                        (item) => item.kategori_lomba
                                    )}
                                    label="Kategori Lomba"
                                />
                            </DataTableControls>
                        );
                    }}
                </DataTable>
            </div>
        </AuthenticatedLayout>
    );
};

export default DataPengajuanLomba;

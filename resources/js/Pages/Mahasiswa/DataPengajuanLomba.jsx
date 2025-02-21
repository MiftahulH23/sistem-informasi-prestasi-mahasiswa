import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { DataTable } from "@/Components/DataTable";
import { id as idLocale } from "date-fns/locale";
import { format, getDate } from "date-fns";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
const DataPengajuanLomba = ({ pengajuanLomba }) => {
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
            accessorKey: "kategori.kategori_lomba",
            header: "Kategori Lomba",
        },
        {
            accessorKey: "tingkat_lomba",
            header: "Tingkat Lomba",
        },
        {
            accessorKey: "dosen_pembimbing",
            header: "Pembimbing",
        },
        {
            accessorKey: "jumlah_peserta",
            header: "Jumlah Peserta",
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
            accessorKey: "status",
            header: "Status",
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
    ];
    return (
        <AuthenticatedLayout>
            <Head title="Data Pengajuan Lomba" />
            <div className="overflow-x-auto p-4">
                <DataTable columns={columns} data={pengajuanLomba} />
            </div>
        </AuthenticatedLayout>
    );
};

export default DataPengajuanLomba;

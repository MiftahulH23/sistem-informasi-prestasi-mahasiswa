import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import { customFilterFns } from "@/Components/data-table/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { format, getDate } from "date-fns";
import { id, id as idLocale } from "date-fns/locale";

const DataPengajuanLomba = ({ pengajuanLomba, kategoriLomba }) => {
    const DetailPengajuanLomba = (id) => {
        router.get(`/pengajuan-lomba/show/${id}`);
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
            header: "Kategori Lomba",
            filterFn: "checkbox",
        },
        {
            id: "tingkat_lomba",
            accessorKey: "tingkat_lomba",
            header: "Tingkat Lomba",
            filterFn: "checkbox",
        },
        {
            id: "dosen_pembimbing",
            accessorKey: "dosen_pembimbing",
            header: "Pembimbing",
        },
        // accessorFn: (row) => row.dosen?.name ?? "-",
        {
            id: "jenis_lomba",
            accessorKey: "jenis_lomba",
            header: "Jenis Lomba",
            filterFn: "checkbox",
        },
        {
            id: "tanggal_mulai",
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
            filterFn: "date-year",
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
            accessorKey: "Detail",
            header: "Detail",
            cell: ({ row }) => {
                const id = row.original.pengajuanlomba_id;
                return (
                    <div className="flex gap-2 items-center">
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
    ];
    const statusPengajuan = ["Diajukan", "Diterima", "Ditolak"];
    const tingkatLomba = [
        "Internasional",
        "Nasional",
        "Provinsi",
        "Lokal-Wilayah",
    ];
    const jenisLomba = ["Akademik", "Non-Akademik"];
    const breadcrumb = [
        {
            title: "Pengajuan Lomba",
            href: "/pengajuan-lomba",
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Data Pengajuan Lomba" />
            <h1>Data Pengajuan Lomba</h1>
            <DataTable columns={columns} data={pengajuanLomba}>
                {({ table }) => {
                    return (
                        <DataTableControls
                            table={table}
                            action={
                                <button
                                    onClick={() =>
                                        router.get("/pengajuan-lomba/create")
                                    }
                                    className="bg-blue-600 py-2 px-4 text-white rounded-md ms-auto hover:cursor-pointer"
                                >
                                    Tambah
                                </button>
                            }
                        >
                            <DataTableFilter
                                table={table}
                                extend={[
                                    {
                                        id: "status",
                                        label: "Status",
                                        data: statusPengajuan,
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
                                        id: "kategorilomba_id",
                                        label: "Kategori Lomba",
                                    },
                                    {
                                        id: "kategorilomba_id",
                                        label: "Kategori Lomba",
                                        data: kategoriLomba,
                                    },
                                    {
                                        id: "tanggal_mulai",
                                        detached: true,
                                    },
                                ]}
                            />
                            <DataTableFilter
                                table={table}
                                filter="tanggal_mulai"
                                label="Tahun"
                                standalone
                            />
                        </DataTableControls>
                    );
                }}
            </DataTable>
        </AuthenticatedLayout>
    );
};

export default DataPengajuanLomba;

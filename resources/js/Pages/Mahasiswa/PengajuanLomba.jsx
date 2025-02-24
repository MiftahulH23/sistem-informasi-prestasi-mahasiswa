import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    customDataFilter,
    DataTable,
    DataTableControls,
    DataTableFilter,
} from "@/Components/DataTable";
import { id, id as idLocale } from "date-fns/locale";
import { format, getDate } from "date-fns";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

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
            accessorKey: "jenis_lomba",
            header: "Jenis Lomba",
            filterFn: customDataFilter(),
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
                <DataTable columns={columns} data={pengajuanLomba}>
                    {({ table }) => {
                        return (
                            <DataTableControls>
                                <DataTableFilter
                                    table={table}
                                    filter="status"
                                    data={statusPengajuan}
                                    label="Status"
                                />
                                <DataTableFilter
                                    table={table}
                                    filter="kategorilomba_id"
                                    data={kategoriLomba.map(
                                        (item) => item.kategori_lomba
                                    )}
                                    label="Kategori Lomba"
                                />
                                <DataTableFilter
                                    table={table}
                                    filter="tingkat_lomba"
                                    label="Tingkat Lomba"
                                    data={tingkatLomba}
                                />
                                <DataTableFilter
                                    table={table}
                                    filter="jenis_lomba"
                                    label="Jenis Lomba"
                                    data={jenisLomba}
                                />
                                <button
                                    onClick={() =>
                                        router.get("/pengajuan-lomba/create")
                                    }
                                    className="bg-blue-600 py-2 px-4 text-white rounded-md ms-auto"
                                >
                                    Tambah
                                </button>
                            </DataTableControls>
                        );
                    }}
                </DataTable>
            </div>
        </AuthenticatedLayout>
    );
};

export default DataPengajuanLomba;

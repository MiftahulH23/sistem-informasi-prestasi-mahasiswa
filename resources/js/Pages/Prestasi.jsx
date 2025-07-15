import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import { customFilterFns } from "@/Components/data-table/utils";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { format, getDate } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import ExportButton from "@/Components/ExportButton";

const Prestasi = ({ prestasi }) => {
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
        // {
        //     accessorKey: "pengajuan_lomba.anggota_nama",
        //     header: "Nama Peserta",
        //     cell: ({ row }) => {
        //         const anggota =
        //             row.original.pengajuan_lomba?.anggota_nama ?? [];
        //         return anggota.length > 0
        //             ? anggota.join(", ")
        //             : "Tidak ada anggota";
        //     },
        // },

        {
            accessorKey: "capaian_prestasi",
            header: "Capaian Prestasi",
            filterFn: "checkbox",
        },
        {
            id: "tingkat_lomba",
            accessorKey: "pengajuan_lomba.tingkat_lomba",
            header: "Tingkat Lomba",
            filterFn: "checkbox",
        },
        {
            id: "program_studi",
            accessorKey: "pengajuan_lomba.program_studi",
            header: "Program Studi",
            filterFn: "array-includes",
        },
        {
            id: "kategori_lomba",
            accessorKey: "pengajuan_lomba.kategori.kategori_lomba",
            header: "Kategori",
            filterFn: "checkbox",
        },
        {
            id: "jenis_lomba",
            accessorKey: "pengajuan_lomba.jenis_lomba",
            header: "Jenis Lomba",
            filterFn: "checkbox",
        },
        {
            id: "tahun",
            accessorKey: "pengajuan_lomba.tanggal_mulai",
            header: "Tanggal",
            cell: ({ row: { original: data } }) => {
                if (!data?.pengajuan_lomba?.tanggal_mulai) {
                    return <span>-</span>; // Tampilkan tanda "-" jika data kosong
                }

                const dateOpt = {
                    locale: idLocale,
                    weekStartsOn: 1,
                };

                const dateObj = new Date(data.pengajuan_lomba.tanggal_mulai);

                if (isNaN(dateObj)) {
                    return <span>Invalid Date</span>; // Jika parsing gagal, tampilkan pesan error
                }

                const date = format(dateObj, "d", dateOpt);
                const month = format(dateObj, "LLL", dateOpt);
                const fullDate = format(dateObj, "PPPP", dateOpt);

                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className=" bg-card flex size-9 cursor-default flex-col items-center justify-center rounded-md border text-center">
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
    ];

    const tingkatLomba = [
        "Internasional",
        "Nasional",
        "Provinsi",
        "Lokal-Wilayah",
    ];
    const jenisLomba = ["Akademik", "Non-Akademik"];
    const capaianPrestasi = [
        "Juara 1",
        "Juara 2",
        "Juara 3",
        "Harapan 1",
        "Harapan 2",
        "Harapan 3",
        "Peserta",
    ];
    const breadcrumb = [
        {
            title: "Prestasi",
            href: "/prestasi",
        },
    ];
    const program_studi = [
        "TET",
        "TL",
        "TM",
        "TRJT",
        "TRSE",
        "TRM",
        "TI",
        "SI",
        "TRK",
        "AktP",
        "HMKD",
        "BD"
    ];
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Data Prestasi" />
            <h1>Prestasi Mahasiswa</h1>
            <DataTable columns={columns} data={prestasi}>
                {({ table }) => {
                    return (
                        <DataTableControls
                            table={table}
                            className="w-full overflow-x-auto"
                            action={
                                <div className="flex w-full items-center justify-end gap-2">
                                    <ExportButton table={table} />
                                </div>
                            }
                        >
                            <DataTableFilter
                                table={table}
                                extend={[
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
                                        id: "program_studi",
                                        label: "Program Studi",
                                        data: program_studi,
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
                                    {
                                        id: "tahun",
                                        detached: true,
                                    },
                                ]}
                            />
                            <DataTableFilter
                                table={table}
                                filter="tahun"
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

export default Prestasi;

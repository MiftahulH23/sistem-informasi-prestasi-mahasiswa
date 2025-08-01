import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { FileImage, Link } from "lucide-react";
import { FaRegFilePdf } from "react-icons/fa6";
const PelaporanPrestasi = ({ prestasi }) => {
    const columns = [
        {
            id: "Nomor",
            header: "No",
            cell: (info) => info.row.index + 1,
        },
        {
            accessorKey: "pengajuan_lomba.judul_lomba",
            header: "Judul Lomba",
        },
        {
            id: "kategori_lomba",
            accessorKey: "pengajuan_lomba.kategori.kategori_lomba",
            header: "Kategori Lomba",
            filterFn: "checkbox",
        },
        {
            id: "capaian_prestasi",
            accessorKey: "capaian_prestasi",
            header: "Capaian Prestasi",
            filterFn: "checkbox",
        },
        {
            accessorKey: "sertifikat",
            header: "Sertifikat",
            cell: ({ row }) => {
                const sertifikat = row.original.sertifikat;
                return sertifikat ? (
                    <a
                        href={`/storage/${sertifikat}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        <div className="inline-flex items-center gap-1 text-blue-700 px-3 py-1 rounded-xl text-sm hover:bg-blue-200 cursor-pointer transition">
                            <FaRegFilePdf className="w-4 h-4" />
                            <span>Buka</span>
                        </div>
                    </a>
                ) : (
                    "Tidak ada file"
                );
            },
        },
        {
            accessorKey: "url_media_sosial",
            header: "URL Media Sosial",
            cell: ({ row }) => {
                const url = row.original.url_media_sosial;
                return url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        <div className="inline-flex items-center gap-1 text-blue-700 px-3 py-1 rounded-xl text-sm hover:bg-blue-200 cursor-pointer transition">
                            <Link size={14} />
                            <span>Kunjungi</span>
                        </div>
                    </a>
                ) : (
                    "Tidak ada URL"
                );
            },
        },
        {
            accessorKey: "dokumentasi",
            header: "Dokumentasi",
            cell: ({ row }) => {
                let dokumentasi = row.original.dokumentasi;

                // Cek jika dokumentasi adalah string, konversi menjadi array
                if (typeof dokumentasi === "string") {
                    try {
                        dokumentasi = JSON.parse(dokumentasi); // Jika JSON array, parse
                    } catch (error) {
                        dokumentasi = dokumentasi.split(","); // Jika dipisah koma, ubah ke array
                    }
                }

                // Jika setelah dikonversi masih bukan array atau kosong
                if (!Array.isArray(dokumentasi) || dokumentasi.length === 0) {
                    return "Tidak ada dokumentasi";
                }

                return (
                    <div className="gap-2 grid grid-cols-2">
                        {dokumentasi.map((file, index) => (
                            <a
                                key={index}
                                href={`/storage/${file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                <div className="inline-flex items-center gap-1 text-blue-700 px-3 py-1 rounded-xl text-sm hover:bg-blue-200 cursor-pointer transition">
                                    <FileImage size={14} />
                                    <span>{index + 1}</span>
                                </div>
                                
                            </a>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: "pengajuan_lomba.surat_tugas",
            header: "Surat Tugas",
            cell: ({ row }) => {
                const suratTugas = row.original.pengajuan_lomba?.surat_tugas;
                return suratTugas ? (
                    <a
                        href={`/storage/${suratTugas}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        <div className="inline-flex items-center gap-1 text-blue-700 px-3 py-1 rounded-xl text-sm hover:bg-blue-200 cursor-pointer transition">
                            <FaRegFilePdf className="w-4 h-4" />
                            <span>Buka</span>
                        </div>
                    </a>
                ) : (
                    "Tidak ada file"
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
        {
            id: "catatan",
            header: "Catatan",
            cell: ({ row }) => {
                const catatan = row.original.catatan;
                return (
                    <div className="text-sm text-slate-600">
                        {catatan ? catatan : "Pelaporan sedang diproses"}
                    </div>
                );
            },
        },
    ];
    const CapaianPrestasi = [
        "Juara 1",
        "Juara 2",
        "Juara 3",
        "Harapan 1",
        "Harapan 2",
        "Harapan 3",
        "Peserta",
    ];
    const Status = ["Diajukan", "Diterima", "Ditolak"];
    const breadcrumb = [
        {
            title: "Pelaporan Prestasi",
            href: "/pelaporan-prestasi",
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Pelaporan Prestasi" />
            <h1>Pelaporan Prestasi</h1>
            <DataTable columns={columns} data={prestasi} className="">
                {({ table }) => {
                    return (
                        <DataTableControls table={table} action={
                            <button
                                onClick={() =>
                                    router.get("/pelaporan-prestasi/create")
                                }
                                className="bg-blue-600 py-2 px-4 text-white rounded-md hover:cursor-pointer"
                            >
                                Tambah
                            </button>
                        }>
                            <DataTableFilter
                                table={table}
                                extend={[
                                    {
                                        id: "capaian_prestasi",
                                        label: "Capaian Prestasi",
                                        data: CapaianPrestasi,
                                    },
                                    {
                                        id: "kategori_lomba",
                                        label: "Kategori Lomba",
                                    },
                                    {
                                        id: "status",
                                        label: "Status",
                                        data: Status,
                                    },
                                ]}
                            />
                            
                        </DataTableControls>
                    );
                }}
            </DataTable>
        </AuthenticatedLayout>
    );
};

export default PelaporanPrestasi;

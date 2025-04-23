import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import { customFilterFns } from "@/Components/data-table/utils";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";

const UpdateStatusPelaporanPrestasi = ({ prestasi }) => {
    // Inisialisasi reviewed berdasarkan status prestasi
    const [reviewed, setReviewed] = useState(
        prestasi.reduce((acc, item) => {
            acc[item.prestasi_id] = item.status !== "Diajukan"; // Jika bukan "Diajukan", maka sudah direview
            return acc;
        }, {})
    );

    const updateStatus = (id, status) => {
        router.put(
            `/pelaporan-prestasi/${id}/update-status`,
            { status },
            {
                onSuccess: () => {
                    setReviewed((prev) => ({ ...prev, [id]: true })); // Tandai sebagai sudah direview
                    Swal.fire(
                        "Berhasil!",
                        "Status pengajuan berhasil diubah.",
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
            accessorKey: "pengajuan_lomba.judul_lomba",
            header: "Judul Lomba",
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
                        Lihat Sertifikat
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
                        Kunjungi
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
                    <div className="flex gap-2 justify-center">
                        {dokumentasi.map((file, index) => (
                            <a
                                key={index}
                                href={`/storage/${file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline"
                            >
                                Gambar {index + 1}
                            </a>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: "surat_tugas",
            header: "Surat Tugas",
            cell: ({ row }) => {
                const suratTugas = row.original.surat_tugas;
                return suratTugas ? (
                    <a
                        href={`/storage/${suratTugas}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Lihat Surat
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
            id: "Aksi",
            header: "Aksi",
            cell: ({ row }) => {
                const id = row.original.prestasi_id;
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
    return (
        <AuthenticatedLayout>
            <Head title="Update Pelaporan Prestasi" />
            <h1>Update Pelaporan Prestasi</h1>
            <DataTable columns={columns} data={prestasi}>
                {({ table }) => (
                    <DataTableControls table={table}>
                        <DataTableFilter
                            table={table}
                            extend={[
                                {
                                    id: "capaian_prestasi",
                                    label: "Capaian Prestasi",
                                    data: CapaianPrestasi,
                                },
                                {
                                    id: "status",
                                    label: "Status",
                                    data: Status,
                                },
                            ]}
                        />
                        <button
                            onClick={() =>
                                router.get("/pelaporan-prestasi/create")
                            }
                            className="bg-blue-600 py-2 px-4 text-white rounded-md ms-auto"
                        >
                            Tambah
                        </button>
                    </DataTableControls>
                )}
            </DataTable>
        </AuthenticatedLayout>
    );
};

export default UpdateStatusPelaporanPrestasi;

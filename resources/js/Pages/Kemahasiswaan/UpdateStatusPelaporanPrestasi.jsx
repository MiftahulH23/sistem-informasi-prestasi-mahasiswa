import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import { customFilterFns } from "@/Components/data-table/utils";
import Modal from "@/Components/Modal";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { FileImage, Link, X } from "lucide-react";
import { useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6";
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
        if (status === "Diterima") {
            router.put(
                `/pelaporan-prestasi/${id}/update-status`,
                { status, catatan: "Laporan Diterima" },
                {
                    onSuccess: () => {
                        setReviewed((prev) => ({ ...prev, [id]: true })); // Tandai sebagai sudah direview
                        Swal.fire(
                            "Berhasil!",
                            "Status pengajuan berhasil diubah.",
                            "success"
                        );
                        setReviewed((prev) => ({ ...prev, [id]: true }));
                    },
                }
            );
        } else if (status === "Ditolak") {
            setSelectedId(id); // simpan id untuk dipakai saat submit catatan
            setSelectedStatus(status); // bisa diabaikan kalau tidak perlu
            setShowModal(true); // tampilkan modal catatan
        }
    };

    const [showCatatanModal, setShowCatatanModal] = useState(false);
    const [catatan, setCatatan] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const handleTolakClick = (id) => {
        setSelectedId(id);
        setShowCatatanModal(true);
    };

    const kirimPenolakan = () => {
        router.put(
            `/pelaporan-prestasi/${selectedId}/update-status`,
            {
                status: "Ditolak",
                catatan: catatan,
            },
            {
                onSuccess: () => {
                    Swal.fire(
                        "Ditolak!",
                        "Pengajuan ditolak",
                        "success"
                    );
                    setShowCatatanModal(false);
                    setCatatan("");
                    setReviewed((prev) => ({ ...prev, [selectedId]: true }));
                },
                onError: (errors) => {
                    setShowCatatanModal(false);
                    const message = Object.values(errors)[0];
                    Swal.fire("Gagal!", message, "error");
                },
            }
        );
    };
    const handleConfirm = (id, status) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: `Status bimbingan akan diubah menjadi ${status}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, lanjutkan",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                updateStatus(id, status);
            }
        });
    };

    const columns = [
        {
            id: "Nomor",
            header: "No",
            cell: (info) => info.row.index + 1,
        },
        {
            accessorKey: "pengajuan_lomba.user.name",
            header: "Ketua Tim",
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
                    <div className="grid grid-cols-2 gap-2">
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
                                    <span>{index + 1}</span>{" "}
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
            id: "Aksi",
            header: "Aksi",
            cell: ({ row }) => {
                const id = row.original.prestasi_id;
                return reviewed[id] ? (
                    <span className="text-gray-500">Sudah Direview</span>
                ) : (
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => handleConfirm(id, "Diterima")}
                            className="bg-blue-500 text-white px-1 rounded size-5 hover:cursor-pointer"
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
                            onClick={() => handleTolakClick(id)}
                            className="bg-red-500 text-white px-1 rounded size-5 hover:cursor-pointer"
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
    const breadcrumb = [
        {
            title: "Pelaporan Prestasi",
            href: "/pelaporan-prestasi/update",
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
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
                    </DataTableControls>
                )}
            </DataTable>
            {showCatatanModal && (
                <Dialog
                    open={showCatatanModal}
                    onOpenChange={() => setShowCatatanModal(false)}
                >
                    <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold mb-2">
                                Catatan Penolakan
                            </h2>
                        </div>
                        <textarea
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            className="w-full border p-2 mb-4"
                            rows={4}
                            placeholder="Tulis alasan penolakan..."
                        ></textarea>
                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-400 text-white px-3 py-1 rounded hover:cursor-pointer"
                                onClick={() => setShowCatatanModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="bg-red-500 text-white px-3 py-1 rounded hover:cursor-pointer"
                                onClick={kirimPenolakan}
                            >
                                Tolak
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </AuthenticatedLayout>
    );
};

export default UpdateStatusPelaporanPrestasi;

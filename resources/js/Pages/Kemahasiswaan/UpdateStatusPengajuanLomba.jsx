import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import { customFilterFns } from "@/Components/data-table/utils";
import { SquarePen, Trash2, X } from "lucide-react";
import Modal from "@/Components/Modal";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { format, getDate } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { useState } from "react";
import Swal from "sweetalert2";
import { Dialog, DialogContent } from "@/Components/ui/dialog";

const UpdateStatusPengajuanLomba = ({ pengajuanLomba, kategoriLomba }) => {
    const [reviewed, setReviewed] = useState(
        pengajuanLomba.reduce((acc, lomba) => {
            acc[lomba.pengajuanlomba_id] = lomba.status !== "Diajukan";
            return acc;
        }, {})
    );

    const updateStatus = (id, status) => {
        if (status === "Diterima") {
            router.put(
                `/pengajuan-lomba/${id}/update-status`,
                {
                    status: status,
                    catatan: "Silahkan Mengikuti Lomba",
                },
                {
                    onSuccess: () => {
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

    const DetailPengajuanLomba = (id) => {
        router.get(`/pengajuan-lomba/update/show/${id}`);
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
            `/pengajuan-lomba/${selectedId}/update-status`,
            {
                status: "Ditolak",
                catatan: catatan,
            },
            {
                onSuccess: () => {
                    Swal.fire(
                        "Ditolak!",
                        "Pengajuan ditolak dengan catatan.",
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
            id: "user_id",
            accessorKey: "user.name",
            header: "Ketua Tim",
        },
        {
            id: "kategorilomba_id",
            accessorKey: "kategori.kategori_lomba",
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
            accessorKey: "jenis_lomba",
            header: "Jenis Lomba",
            filterFn: "checkbox",
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
            id: "Aksi",
            header: "Aksi",
            cell: ({ row }) => {
                const id = row.original.pengajuanlomba_id;
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
            href: "/pengajuan-lomba/update",
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Data Pengajuan Lomba" />
            <h1>Pengajuan Lomba</h1>
            <DataTable columns={columns} data={pengajuanLomba}>
                {({ table }) => {
                    return (
                        <DataTableControls table={table}>
                            <DataTableFilter
                                table={table}
                                extend={[
                                    {
                                        id: "kategorilomba_id",
                                        label: "Kategori Lomba",
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
                                        id: "status",
                                        label: "Status",
                                        data: statusPengajuan,
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
                            required
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

export default UpdateStatusPengajuanLomba;

import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import { customFilterFns } from "@/Components/data-table/utils";
import Modal from "@/Components/Modal";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { SquarePen, Trash2, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

const KategoriLomba = ({ kategoriLomba }) => {
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset, errors } = useForm({
        kategori_lomba: "",
    });

    // State untuk modal edit
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState(null);
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        kategori_lomba: "",
    });

    // Handle tambah kategori
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("kategori-lomba.store"), {
            onSuccess: () => {
                reset();
                Swal.fire(
                    "Berhasil!",
                    "Kategori berhasil ditambah.",
                    "success"
                );
            },
        });
    };

    // Handle hapus kategori
    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data yang dihapus tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("kategori-lomba.destroy", id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Berhasil!",
                            "Kategori telah dihapus.",
                            "success"
                        );
                    },
                });
            }
        });
    };

    // Handle edit kategori (buka modal & set data)
    const openEditModal = (kategori) => {
        setSelectedKategori(kategori);
        setEditData({
            kategori_lomba: kategori.kategori_lomba,
        });
        setEditModalOpen(true);
    };

    // Handle simpan edit kategori
    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(route("kategori-lomba.update", selectedKategori.kategorilomba_id), {
            onSuccess: () => {
                setEditModalOpen(false);
                Swal.fire("Berhasil!", "Kategori telah diperbaru.", "success");
            },
        });
    };

    const columns = [
        {
            id: "Nomor",
            header: "No",
            cell: (info) => info.row.index + 1,
        },
        {
            id: "kategori_lomba",
            header: "Kategori Lomba",
            accessorKey: "kategori_lomba",
            filterFn: customFilterFns["checkbox"]
        },
        {
            id: "Aksi",
            header: "Aksi",
            cell: (info) => (
                <div className="flex gap-2 justify-center">
                    <SquarePen
                        className="cursor-pointer text-blue-500 size-5"
                        onClick={() => openEditModal(info.row.original)}
                    />
                    <Trash2
                        className="cursor-pointer text-red-500 size-5"
                        onClick={() =>
                            handleDelete(info.row.original.kategorilomba_id)
                        }
                    />
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Kategori Lomba" />
            <h1 className="text-xl font-bold mb-4">Kategori Lomba</h1>
            {/* Form Tambah */}
            <form
                onSubmit={handleSubmit}
                className="flex justify-start items-center gap-5"
            >
                <div className="flex gap-2 items-center">
                    <Label className="w-40">Kategori Lomba</Label>
                    <Input
                        name="kategori_lomba"
                        value={data.kategori_lomba}
                        onChange={(e) =>
                            setData("kategori_lomba", e.target.value)
                        }
                        placeholder="Masukkan kategori"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    disabled={processing}
                >
                    {processing ? "Menyimpan..." : "Tambah"}
                </button>
            </form>

            {/* Tampilkan error validasi */}
            {errors.kategori_lomba && (
                <p className="text-red-500">{errors.kategori_lomba}</p>
            )}
            <DataTable columns={columns} data={kategoriLomba}>
                {({ table }) => (
                    <DataTableControls table={table}>
                        <DataTableFilter
                            table={table}
                            extend={[
                                {
                                    id: "kategori_lomba",
                                    label: "Kategori Lomba",
                                }
                            ]}
                        />
                    </DataTableControls>
                )}
            </DataTable>
            {/* Modal Edit */}
            <Modal
                show={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
            >
                <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Edit Kategori</h2>
                        <X
                            className="cursor-pointer text-gray-500"
                            onClick={() => setEditModalOpen(false)}
                        />
                    </div>
                    <form onSubmit={handleEditSubmit}>
                        <Label>Kategori Lomba</Label>
                        <Input
                            name="kategori_lomba"
                            value={editData.kategori_lomba}
                            onChange={(e) =>
                                setEditData("kategori_lomba", e.target.value)
                            }
                        />
                        {editErrors.kategori_lomba && (
                            <p className="text-red-500">
                                {editErrors.kategori_lomba}
                            </p>
                        )}
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-3 py-1 rounded"
                                onClick={() => setEditModalOpen(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                                disabled={editProcessing}
                            >
                                {editProcessing ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
};

export default KategoriLomba;

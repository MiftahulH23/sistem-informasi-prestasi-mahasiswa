import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import Modal from "@/Components/Modal";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { SquarePen, Trash2, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

const KategoriLomba = ({ kategoriLomba }) => {
    const { flash } = usePage().props;

    // State form tambah
    const { data, setData, post, processing, reset, errors } = useForm({
        kategori_lomba: "",
    });
    const [isAddModalOpen, setAddModalOpen] = useState(false);

    // State form edit
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
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setAddModalOpen(false);
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

    // Handle buka modal edit
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
                Swal.fire("Berhasil!", "Kategori telah diperbarui.", "success");
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
            filterFn: "checkbox",
        },
        {
            id: "Aksi",
            header: "Aksi",
            cell: (info) => (
                <div className="flex gap-2">
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
    const breadcrumb = [
        {
            title: "Kategori Lomba",
            href: "/kategori-lomba",
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Kategori Lomba" />
            <h1 className="text-xl font-bold mb-4">Kategori Lomba</h1>

            {/* Tombol Tambah (Buka Modal) */}

            {/* Tabel */}
            <DataTable columns={columns} data={kategoriLomba}>
                {({ table }) => (
                    <DataTableControls table={table}>
                        <DataTableFilter
                            table={table}
                            extend={[
                                {
                                    id: "kategori_lomba",
                                    label: "Kategori Lomba",
                                },
                            ]}
                        />
                        <button
                            onClick={() => setAddModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2 ms-auto hover:cursor-pointer"
                        >
                            Tambah
                        </button>
                    </DataTableControls>
                )}
            </DataTable>

            {/* Modal Tambah */}
            <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
                <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Tambah Kategori</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <Label required>Kategori Lomba</Label>
                        <Input
                            id="kategori_lomba"
                            name="kategori_lomba"
                            type="text"
                            value={data.kategori_lomba}
                            onChange={(e) =>
                                setData("kategori_lomba", e.target.value)
                            }
                            placeholder="Masukkan kategori"
                            required
                        />
                        {errors.kategori_lomba && (
                            <p className="text-red-500 mt-1">
                                {errors.kategori_lomba}
                            </p>
                        )}
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-3 py-1 rounded hover:cursor-pointer"
                                onClick={() => setAddModalOpen(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:cursor-pointer"
                                disabled={processing}
                            >
                                {processing ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Modal Edit */}
            <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
                <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Edit Kategori</h2>
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
                            <p className="text-red-500 mt-1">
                                {editErrors.kategori_lomba}
                            </p>
                        )}
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-3 py-1 rounded hover:cursor-pointer"
                                onClick={() => setEditModalOpen(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:cursor-pointer"
                                disabled={editProcessing}
                            >
                                {editProcessing ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default KategoriLomba;

import Modal from "@/Components/Modal";
import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { SquarePen, Trash2, X } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

const JudulLomba = () => {
    const { kategoriLomba, judulLomba } = usePage().props;

    // Form tambah
    const { data, setData, post, processing, reset, errors } = useForm({
        judul_lomba: "",
        kategorilomba_id: "",
    });

    // Form edit
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        judullomba_id: "",
        judul_lomba: "",
        kategorilomba_id: "",
    });

    // Modal State
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    // Submit tambah
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("judul-lomba.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setAddModalOpen(false);
                Swal.fire("Berhasil!", "Judul berhasil ditambah.", "success");
            },
        });
    };

    // Buka modal edit
    const openEditModal = (judul) => {
        setEditData({
            judullomba_id: judul.judullomba_id,
            judul_lomba: judul.judul_lomba,
            kategorilomba_id: judul.kategorilomba_id,
        });
        setEditModalOpen(true);
    };

    // Submit edit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(route("judul-lomba.update", editData.judullomba_id), {
            data: editData,
            onSuccess: () => {
                setEditModalOpen(false);
                Swal.fire("Berhasil!", "Judul berhasil diperbarui.", "success");
            },
        });
    };

    // Hapus data
    const handleDelete = (id) => {
        if (!id) {
            Swal.fire("Error!", "ID tidak ditemukan.", "error");
            return;
        }

        Swal.fire({
            title: "Apakah Anda yakin?",
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya, hapus!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("judul-lomba.destroy", id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Berhasil!",
                            "Judul telah dihapus.",
                            "success"
                        );
                    },
                });
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
            id: "judul_lomba",
            header: "Judul Lomba",
            accessorKey: "judul_lomba",
            filterFn: "checkbox",
        },
        {
            id: "Kategori Lomba",
            header: "Kategori Lomba",
            accessorKey: "kategori.kategori_lomba",
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
                            handleDelete(info.row.original.judullomba_id)
                        }
                    />
                </div>
            ),
        },
    ];
    const breadcrumb = [
        {
            title: "Judul Lomba",
            href: "/judul-lomba",
        },
    ];

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Judul Lomba" />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Judul Lomba</h1>
            </div>

            {/* Tabel Data */}
            <DataTable columns={columns} data={judulLomba}>
                {({ table }) => (
                    <DataTableControls table={table}>
                        <DataTableFilter table={table} />
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
            {isAddModalOpen && (
                <Dialog open={isAddModalOpen} onOpenChange={setAddModalOpen}>
                    <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">
                                Tambah Judul Lomba
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <Label>Judul Lomba</Label>
                            <Input
                                name="judul_lomba"
                                value={data.judul_lomba}
                                onChange={(e) =>
                                    setData("judul_lomba", e.target.value)
                                }
                                required
                                placeholder="Masukkan judul lomba"
                                className="mb-4"
                            />
                            {errors.judul_lomba && (
                                <p className="text-red-500 mt-1">
                                    {errors.judul_lomba}
                                </p>
                            )}

                            <Label>Kategori Lomba</Label>
                            <select
                                name="kategorilomba_id"
                                value={data.kategorilomba_id}
                                onChange={(e) =>
                                    setData("kategorilomba_id", e.target.value)
                                }
                                
                                className="border rounded p-2 w-full mb-4"
                                required
                            >
                                <option value="">Pilih Kategori</option>
                                {kategoriLomba.map((kategori) => (
                                    <option
                                        key={kategori.kategorilomba_id}
                                        value={kategori.kategorilomba_id}
                                    >
                                        {kategori.kategori_lomba}
                                    </option>
                                ))}
                            </select>
                            {errors.kategorilomba_id && (
                                <p className="text-red-500 mt-1">
                                    {errors.kategorilomba_id}
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
            )}

            {/* Modal Edit */}
            {isEditModalOpen && (
                <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
                    <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">
                                Edit Judul Lomba
                            </h2>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <Label>Judul Lomba</Label>
                            <Input
                                name="judul_lomba"
                                value={editData.judul_lomba}
                                onChange={(e) =>
                                    setEditData("judul_lomba", e.target.value)
                                }
                                required
                                className="mb-4"
                            />

                            <Label>Kategori Lomba</Label>
                            <select
                                name="kategorilomba_id"
                                value={editData.kategorilomba_id}
                                onChange={(e) =>
                                    setEditData(
                                        "kategorilomba_id",
                                        e.target.value
                                    )
                                }
                                required
                                className="border rounded p-2 w-full mb-4"
                            >
                                <option value="">Pilih Kategori</option>
                                {kategoriLomba.map((kategori) => (
                                    <option
                                        key={kategori.kategorilomba_id}
                                        value={kategori.kategorilomba_id}
                                    >
                                        {kategori.kategori_lomba}
                                    </option>
                                ))}
                            </select>

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
            )}
        </AuthenticatedLayout>
    );
};

export default JudulLomba;

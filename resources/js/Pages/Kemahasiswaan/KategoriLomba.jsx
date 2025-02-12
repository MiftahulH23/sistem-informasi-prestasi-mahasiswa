import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import AlertSucces from "@/Components/AlertSucces";
import { Trash2, SquarePen, X } from "lucide-react";
import Modal from "@/Components/Modal";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";



const KategoriLomba = ({ kategoriLomba }) => {
    const { flash } = usePage().props; 
    const { data, setData, post, processing, reset, errors } = useForm({
        kategori_lomba: "",
    });

    // State untuk flash message
    const [flashMessage, setFlashMessage] = useState(flash?.success || "");

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
                Swal.fire("Berhasil!", "Kategori berhasil ditambah.", "success");
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
                        setFlashMessage("Kategori berhasil dihapus.");
                        Swal.fire("Terhapus!", "Kategori telah dihapus.", "success");
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
        put(route("kategori-lomba.update", selectedKategori.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                Swal.fire("Berhasil Update!", "Kategori telah diperbaru.", "success");
            },
        });
    };

    // Hilangkan flash message setelah 3 detik
    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => {
                setFlashMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    return (
        <AuthenticatedLayout>
            <Head title="Kategori Lomba" />
            <h1 className="text-xl font-bold mb-4">Kategori Lomba</h1>
            {/* Form Tambah */}
            <form onSubmit={handleSubmit} className="flex justify-start items-center gap-5">
                <div className="flex gap-2 items-center">
                    <Label className="w-40">Kategori Lomba</Label>
                    <Input
                        name="kategori_lomba"
                        value={data.kategori_lomba}
                        onChange={(e) => setData("kategori_lomba", e.target.value)}
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
            {errors.kategori_lomba && <p className="text-red-500">{errors.kategori_lomba}</p>}
            
            <table className="table mt-4 w-full">
                <thead>
                    <tr className="bg-white text-center rounded-lg">
                        <th className="px-4 py-2">No</th>
                        <th className="px-4 py-2">Kategori Lomba</th>
                        <th className="px-4 py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {kategoriLomba.length > 0 ? (
                        kategoriLomba.map((kategori, index) => (
                            <tr key={kategori.id} className="text-center">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{kategori.kategori_lomba}</td>
                                <td className="px-4 py-2 flex gap-2 justify-center">
                                    <SquarePen
                                        className="cursor-pointer text-blue-500 size-5"
                                        onClick={() => openEditModal(kategori)}
                                    />
                                    <Trash2
                                        className="cursor-pointer text-red-500 size-5"
                                        onClick={() => handleDelete(kategori.id)}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center py-4">
                                Tidak ada data kategori lomba.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal Edit */}
            <Modal show={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
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
                            onChange={(e) => setEditData("kategori_lomba", e.target.value)}
                        />
                        {editErrors.kategori_lomba && (
                            <p className="text-red-500">{editErrors.kategori_lomba}</p>
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

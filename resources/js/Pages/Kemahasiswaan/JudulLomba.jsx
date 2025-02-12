import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import Swal from "sweetalert2";
import { Trash2, SquarePen, X } from "lucide-react";
import Modal from "@/Components/Modal";

const JudulLomba = () => {
    const { kategoriLomba, judulLomba } = usePage().props;

    // Form untuk tambah data
    const { data, setData, post, processing, reset } = useForm({
        judul_lomba: "",
        kategori_lomba_id: "",
    });

    // Form untuk edit data
    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
    } = useForm({
        id: "",
        judul_lomba: "",
        kategori_lomba_id: "",
    });

    // State untuk modal edit
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    // Fungsi untuk submit tambah data
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("judul-lomba.store"), {
            onSuccess: () => {
                reset();
                Swal.fire("Berhasil!", "Judul berhasil ditambah.", "success");
            },
        });
    };

    // Fungsi membuka modal edit
    const openEditModal = (judul) => {
        setEditData({
            id: judul.id,
            judul_lomba: judul.judul_lomba,
            kategori_lomba_id: judul.kategori_lomba_id,
        });
        setEditModalOpen(true);
    };

    // Fungsi submit edit data
    const handleEditSubmit = (e) => {
        e.preventDefault();
        put(route("judul-lomba.update", editData.id), {
            data: editData,
            onSuccess: () => {
                setEditModalOpen(false);
                Swal.fire("Berhasil!", "Judul berhasil diperbarui.", "success");
            },
        });
    };

    // Fungsi hapus data
    const handleDelete = (id) => {
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
                        Swal.fire("Berhasil!", "Judul telah dihapus.", "success");
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Judul Lomba" />
            <h1>Judul Lomba</h1>

            {/* Form Tambah Data */}
            <form onSubmit={handleSubmit} className="flex gap-5">
                <div className="flex gap-2 items-center">
                    <Label className="w-60">Judul Lomba</Label>
                    <Input
                        name="judul_lomba"
                        value={data.judul_lomba}
                        onChange={(e) => setData("judul_lomba", e.target.value)}
                        placeholder="Masukkan judul"
                        required
                    />
                    <Label className="w-60">Kategori Lomba</Label>
                    <select
                        name="kategori_lomba_id"
                        value={data.kategori_lomba_id}
                        onChange={(e) => setData("kategori_lomba_id", e.target.value)}
                        required
                        className="border rounded p-2"
                    >
                        <option value="">Pilih Kategori</option>
                        {kategoriLomba.map((kategori) => (
                            <option key={kategori.id} value={kategori.id}>
                                {kategori.kategori_lomba}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded" disabled={processing}>
                    {processing ? "Menyimpan..." : "Tambah"}
                </button>
            </form>

            {/* Tabel Data */}
            <table className="table mt-4 w-full">
                <thead>
                    <tr className="bg-white text-center rounded-lg">
                        <th className="px-4 py-2">No</th>
                        <th className="px-4 py-2">Judul Lomba</th>
                        <th className="px-4 py-2">Kategori Lomba</th>
                        <th className="px-4 py-2">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {judulLomba.length > 0 ? (
                        judulLomba.map((judul, index) => (
                            <tr key={judul.id} className="text-center">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">{judul.judul_lomba}</td>
                                <td className="px-4 py-2">{judul.kategori.kategori_lomba}</td>
                                <td className="px-4 py-2 flex gap-2 justify-center">
                                    <SquarePen
                                        className="cursor-pointer text-blue-500 size-5"
                                        onClick={() => openEditModal(judul)}
                                    />
                                    <Trash2 className="cursor-pointer text-red-500 size-5" onClick={() => handleDelete(judul.id)} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center py-4">Tidak ada data judul lomba.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal Edit */}
            {isEditModalOpen && (
                <Modal show={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Edit Judul Lomba</h2>
                            <X className="cursor-pointer text-gray-500" onClick={() => setEditModalOpen(false)} />
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <Label>Judul Lomba</Label>
                            <Input
                                name="judul_lomba"
                                value={editData.judul_lomba}
                                onChange={(e) => setEditData("judul_lomba", e.target.value)}
                            />

                            <Label>Kategori Lomba</Label>
                            <select
                                name="kategori_lomba_id"
                                value={editData.kategori_lomba_id}
                                onChange={(e) => setEditData("kategori_lomba_id", e.target.value)}
                                required
                                className="border rounded p-2"
                            >
                                <option value="">Pilih Kategori</option>
                                {kategoriLomba.map((kategori) => (
                                    <option key={kategori.id} value={kategori.id}>
                                        {kategori.kategori_lomba}
                                    </option>
                                ))}
                            </select>

                            <div className="mt-4 flex justify-end gap-2">
                                <button type="button" className="bg-gray-400 text-white px-3 py-1 rounded" onClick={() => setEditModalOpen(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded" disabled={editProcessing}>
                                    {editProcessing ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
};

export default JudulLomba;

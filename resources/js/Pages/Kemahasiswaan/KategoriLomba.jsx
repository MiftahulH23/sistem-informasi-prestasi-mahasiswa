import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useEffect, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import AlertSucces from "@/Components/AlertSucces";

const KategoriLomba = ({kategoriLomba}) => {
    const { flash } = usePage().props; // Ambil pesan flash dari backend
    const { data, setData, post, processing, reset, errors } = useForm({
        kategori_lomba: "",
    });

    // Pastikan flash tidak undefined/null dengan default {}
    const [flashMessage, setFlashMessage] = useState(flash || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("kategori-lomba.store"), {
            onSuccess: () => reset(), // Reset input jika sukses
        });
    };

    // Hilangkan flash message setelah 3 detik
    useEffect(() => {
        if (flash) {
            setFlashMessage(flash); // Set pesan sukses
            const timer = setTimeout(() => {
                setFlashMessage(""); // Hapus setelah 3 detik
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    return (
        <AuthenticatedLayout>
            <Head title="Kategori Lomba" />
            <h1 className="text-xl font-bold mb-4">Kategori Lomba</h1>

            {/* Pesan Sukses (akan hilang setelah 3 detik) */}
            {flashMessage && (
                <AlertSucces className="text-green-600">
                    {flashMessage}
                </AlertSucces>
            )}

            {/* Form */}
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

            {/* Tabel Kategori Lomba */}
            <table className="table">
                {/* Head */}
                <thead>
                    <tr className=" text-center">
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
                                <td className="px-4 py-2">
                                    {kategori.kategori_lomba}
                                </td>
                                <td className="px-4 py-2">
                                    <button className="bg-blue-500 text-white px-2 py-1 rounded">
                                        Lihat Detail
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                Tidak ada data pengajuan lomba.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </AuthenticatedLayout>
    );
};

export default KategoriLomba;

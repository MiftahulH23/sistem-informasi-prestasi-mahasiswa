import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import Swal from "sweetalert2";
import { getPathname } from "@/lib/utils";

const TambahBimbingan = ({ pengajuanlomba_id }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal: "",
        jam_mulai: "",
        jam_selesai: "",
        materi_bimbingan: "",
        catatan_bimbingan: "",
    });

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        post(`/bimbingan/${pengajuanlomba_id}`, {
            onSuccess: () => {
                // Reset form fields on success
                reset();

                // Show SweetAlert success notification
                Swal.fire({
                    title: "Berhasil!",
                    text: "Bimbingan berhasil ditambah.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            },
            onError: (errors) => {
                // Handle form submission errors
                Swal.fire({
                    title: "Oops!",
                    text: "Ada masalah saat menambahkan bimbingan.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            },
        });
    };
    const pathname = getPathname();
    const id  = pathname.split("/")[2]
    const breadcrumb = [
        {
            title: "Bimbingan",
            href: "/bimbingan",
        },
        {
            title: "Detail",
            href: `/bimbingan/${id}`,
        },
        {
            title: "Tambah",
            href: `/bimbingan/${id}/create`,
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Tambah Bimbingan" />
            <h1>Tambah Bimbingan</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="tanggal" data-required>Tanggal Bimbingan</Label>
                        <Input
                            type="date"
                            id="tanggal"
                            name="tanggal"
                            value={data.tanggal}
                            onChange={(e) => setData("tanggal", e.target.value)}
                        />
                        {errors.tanggal && (
                            <p className="text-red-600 text-sm">
                                {errors.tanggal}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="jam_mulai" data-required>Jam Mulai</Label>
                        <Input
                            type="time"
                            id="jam_mulai"
                            name="jam_mulai"
                            value={data.jam_mulai}
                            onChange={(e) =>
                                setData("jam_mulai", e.target.value)
                            }
                        />
                        {errors.jam_mulai && (
                            <p className="text-red-600 text-sm">
                                {errors.jam_mulai}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="jam_selesai" data-required>Jam Selesai</Label>
                        <Input
                            type="time"
                            id="jam_selesai"
                            name="jam_selesai"
                            value={data.jam_selesai}
                            onChange={(e) =>
                                setData("jam_selesai", e.target.value)
                            }
                        />
                        {errors.jam_selesai && (
                            <p className="text-red-600 text-sm">
                                {errors.jam_selesai}
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="materi_bimbingan" data-required>
                            Materi Bimbingan
                        </Label>
                        <Input
                            type="text"
                            id="materi_bimbingan"
                            name="materi_bimbingan"
                            value={data.materi_bimbingan}
                            onChange={(e) =>
                                setData("materi_bimbingan", e.target.value)
                            }
                        />
                        {errors.materi_bimbingan && (
                            <p className="text-red-600 text-sm">
                                {errors.materi_bimbingan}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="catatan_bimbingan" data-required>
                            Catatan Bimbingan
                        </Label>
                        <Input
                            type="text"
                            id="catatan_bimbingan"
                            name="catatan_bimbingan"
                            value={data.catatan_bimbingan}
                            onChange={(e) =>
                                setData("catatan_bimbingan", e.target.value)
                            }
                        />
                        {errors.catatan_bimbingan && (
                            <p className="text-red-600 text-sm">
                                {errors.catatan_bimbingan}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-blue-600 py-2 px-4 text-white rounded-md"
                    >
                        {processing ? "Menyimpan..." : "Tambah"}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default TambahBimbingan;

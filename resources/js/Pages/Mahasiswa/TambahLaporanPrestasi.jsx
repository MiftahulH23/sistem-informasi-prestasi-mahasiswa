import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useRef } from "react";
import Swal from "sweetalert2";

const TambahLaporanPrestasi = ({ lombaOptions }) => {
    const fileInputRefs = {
        sertifikat: useRef(null),
        dokumentasi: useRef(null),
        surat_tugas: useRef(null),
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        pengajuanlomba_id: "",
        capaian_prestasi: "",
        sertifikat: null,
        dokumentasi: [],
        url_media_sosial: "",
        surat_tugas: null,
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "dokumentasi") {
            setData("dokumentasi", [...files]);
        } else {
            setData(name, files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("pelaporan-prestasi.store"), {
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    title: "Berhasil!",
                    text: "Laporan prestasi berhasil ditambah.",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    reset();
                    setData({
                        pengajuanlomba_id: "",
                        capaian_prestasi: "",
                        sertifikat: null,
                        dokumentasi: [],
                        url_media_sosial: "",
                        surat_tugas: null,
                    });

                    // Reset input file secara manual
                    Object.values(fileInputRefs).forEach(ref => {
                        if (ref.current) {
                            ref.current.value = "";
                        }
                    });
                });
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Laporan Prestasi" />
            <h1>Laporan Prestasi</h1>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:grid md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Judul Lomba */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="judul_lomba">Judul Lomba</Label>
                        <select
                            id="judul_lomba"
                            name="pengajuanlomba_id"
                            value={data.pengajuanlomba_id}
                            onChange={(e) => setData("pengajuanlomba_id", e.target.value)}
                        >
                            <option value="" disabled hidden>Pilih Judul Lomba</option>
                            {Object.entries(lombaOptions).map(([id, judul]) => (
                                <option key={id} value={id}>{judul}</option>
                            ))}
                        </select>
                        {errors.pengajuanlomba_id && <p className="text-red-500">{errors.pengajuanlomba_id}</p>}
                    </div>

                    {/* Capaian Prestasi */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="capaian_prestasi">Capaian Prestasi</Label>
                        <select
                            id="capaian_prestasi"
                            name="capaian_prestasi"
                            value={data.capaian_prestasi}
                            onChange={(e) => setData("capaian_prestasi", e.target.value)}
                        >
                            <option value="" disabled hidden>Pilih Capaian Prestasi</option>
                            <option value="Juara 1">Juara 1</option>
                            <option value="Juara 2">Juara 2</option>
                            <option value="Juara 3">Juara 3</option>
                            <option value="Harapan 1">Harapan 1</option>
                            <option value="Harapan 2">Harapan 2</option>
                            <option value="Harapan 3">Harapan 3</option>
                        </select>
                        {errors.capaian_prestasi && <p className="text-red-500">{errors.capaian_prestasi}</p>}
                    </div>

                    {/* Sertifikat */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sertifikat">Sertifikat</Label>
                        <Input
                            id="sertifikat"
                            name="sertifikat"
                            type="file"
                            accept="application/pdf"
                            ref={fileInputRefs.sertifikat}
                            onChange={handleFileChange}
                        />
                        {errors.sertifikat && <p className="text-red-500">{errors.sertifikat}</p>}
                    </div>

                    {/* URL Media Sosial */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="url_media_sosial">URL Media Sosial</Label>
                        <Input
                            id="url_media_sosial"
                            name="url_media_sosial"
                            type="text"
                            value={data.url_media_sosial}
                            onChange={(e) => setData("url_media_sosial", e.target.value)}
                        />
                        {errors.url_media_sosial && <p className="text-red-500">{errors.url_media_sosial}</p>}
                    </div>

                    {/* Dokumentasi */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="dokumentasi">Dokumentasi</Label>
                        <Input
                            id="dokumentasi"
                            name="dokumentasi"
                            type="file"
                            accept="image/*"
                            multiple
                            ref={fileInputRefs.dokumentasi}
                            onChange={handleFileChange}
                        />
                        {errors.dokumentasi && <p className="text-red-500">{errors.dokumentasi}</p>}
                    </div>

                    {/* Surat Tugas */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="surat_tugas">Surat Tugas</Label>
                        <Input
                            id="surat_tugas"
                            name="surat_tugas"
                            type="file"
                            accept="application/pdf"
                            ref={fileInputRefs.surat_tugas}
                            onChange={handleFileChange}
                        />
                        {errors.surat_tugas && <p className="text-red-500">{errors.surat_tugas}</p>}
                    </div>
                </div>

                <div className="flex justify-end mt-5 py-3">
                    <button type="submit" className="bg-blue-600 py-2 px-4 text-white rounded-md" disabled={processing}>
                        {processing ? "Memproses..." : "Tambah"}
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default TambahLaporanPrestasi;

import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select } from "@/Components/ui/select";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React from "react";

const TambahLaporanPrestasi = () => {
    return (
        <AuthenticatedLayout>
            <Head title="Tambah Laporan Prestasi" />
            <h1>Laporan Prestasi</h1>
            <form>
                <div className="flex flex-col md:grid md:grid-cols-2 gap-x-8 gap-y-4">
                    {/* Capaian Prestasi */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="capaian_prestasi">
                            Capaian Prestasi
                        </Label>
                        <select id="capaian_prestasi" name="capaian_prestasi">
                            <option value="" disabled hidden>
                                Pilih Capaian Prestasi
                            </option>
                            <option value="Juara 1">Juara 1</option>
                            <option value="Juara 2">Juara 2</option>
                            <option value="Juara 3">Juara 3</option>
                            <option value="Harapan 1">Harapan 1</option>
                            <option value="Harapan 2">Harapan 2</option>
                            <option value="Harapan 3">Harapan 3</option>
                        </select>
                    </div>

                    {/* Sertifikat */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="sertifikat">Sertifikat</Label>
                        <Input
                            id="sertifikat"
                            name="sertifikat"
                            type="file"
                            accept="application/pdf"
                        />
                    </div>

                    {/* Url Media Sosial */}
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="url_media_sosial">
                            URL Media Sosial
                        </Label>
                        <Input
                            id="url_media_sosial"
                            name="url_media_sosial"
                            type="text"
                        />
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
                        />
                    </div>

                    {/* Surat Tugas */}
                    <div className="flex flex-col gap-2 col-span-2">
                        <Label htmlFor="surat_tugas">Surat Tugas</Label>
                        <Input
                            id="surat_tugas"
                            name="surat_tugas"
                            type="file"
                            accept="application/pdf"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-5 py-3">
                    <button
                        type="submit"
                        className="bg-blue-600 py-2 px-4 text-white rounded-md"
                    >
                        Tambah
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
};

export default TambahLaporanPrestasi;

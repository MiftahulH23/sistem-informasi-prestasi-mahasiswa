import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

const PengajuanLomba = ({ auth }) => {
    const { data, setData, post, processing, reset, errors } = useForm({
        kategori_lomba: "",
        judul_lomba: "",
        jenis_lomba: "",
        tingkat_lomba: "",
        model_pelaksanaan: "",
        dosen_pembimbing: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        jenis_kepesertaan: "",
        jumlah_peserta: 1,
        anggota_kelompok: [],
        surat_tugas: null,
    });

    const [jenisKepesertaan, setJenisKepesertaan] = useState("");
    const [anggotaKelompok, setAnggotaKelompok] = useState([]);

    const handleKepesertaanChange = (e) => {
        const value = e.target.value;
        const formattedValue = value === "individu" ? "Individu" : "Kelompok"; // Sesuaikan dengan backend
        setJenisKepesertaan(value);
        setData("jenis_kepesertaan", formattedValue);

        if (value === "individu") {
            const peserta = [auth.user.name]; // User yang daftar masuk sebagai peserta
            setAnggotaKelompok(peserta);
            setData("anggota_kelompok", peserta);
            setData("jumlah_peserta", 1); // Jika individu, jumlah peserta = 1
        } else {
            setAnggotaKelompok([]); // Reset anggota kelompok
            setData("anggota_kelompok", []);
            setData("jumlah_peserta", 1); // Default, nanti bertambah saat user menambah anggota
        }
    };

    const addAnggota = () => {
        const newAnggota = [...anggotaKelompok, ""];
        setAnggotaKelompok(newAnggota);
        setData("anggota_kelompok", newAnggota);
        setData("jumlah_peserta", newAnggota.length + 1); // Update jumlah peserta
    };

    const removeAnggota = (index) => {
        const newAnggota = anggotaKelompok.filter((_, i) => i !== index);
        setAnggotaKelompok(newAnggota);
        setData("anggota_kelompok", newAnggota);
        setData("jumlah_peserta", newAnggota.length + 1); // Update jumlah peserta
    };

    const handleAnggotaChange = (index, value) => {
        const newAnggota = [...anggotaKelompok];
        newAnggota[index] = value;
        setAnggotaKelompok(newAnggota);
        setData("anggota_kelompok", newAnggota);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.target.reset()

        const formData = new FormData();

        // Pastikan `jenis_kepesertaan` sudah tersimpan dengan benar
        formData.append("jenis_kepesertaan", data.jenis_kepesertaan);

        // Perbaiki jumlah peserta agar dikirim ke backend
        formData.append(
            "jumlah_peserta",
            data.jenis_kepesertaan === "Individu"
                ? 1
                : data.anggota_kelompok.length
        );

        // Kirim array anggota dalam format JSON
        formData.append(
            "anggota_kelompok",
            JSON.stringify(data.anggota_kelompok)
        );

        // Tambahkan data lainnya
        Object.keys(data).forEach((key) => {
            if (
                ![
                    "jenis_kepesertaan",
                    "jumlah_peserta",
                    "anggota_kelompok",
                ].includes(key)
            ) {
                formData.append(key, data[key]);
            }
        });

        // Kirim data dengan Inertia
        post(route("pengajuan-lomba.store"), {
            body: formData,
            headers: { "Content-Type": "multipart/form-data" },
            onSuccess: () => {
                reset(); // Reset form ke nilai awal
                setJenisKepesertaan(""); // Reset jenis kepesertaan
                setAnggotaKelompok([]); // Reset anggota kelompok
                
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col gap-7">
                <Head title="Pengajuan Lomba" />
                <h1 className="text-2xl font-bold">Pengajuan Lomba</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                        type="hidden"
                        name="_token"
                        value="{{ csrf_token() }}"
                    />
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Kategori Lomba */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="kategori_lomba">
                                Kategori Lomba
                            </Label>
                            <select
                                id="kategori_lomba"
                                name="kategori_lomba"
                                onChange={(e) =>
                                    setData("kategori_lomba", e.target.value)
                                }
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="bakornas">Bakornas</option>
                                <option value="puspresnas">Puspresnas</option>
                            </select>
                        </div>

                        {/* Judul Lomba */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="judul_lomba">Judul Lomba</Label>
                            <Input
                                id="judul_lomba"
                                name="judul_lomba"
                                className="h-10"
                                onChange={(e) =>
                                    setData("judul_lomba", e.target.value)
                                }
                            />
                        </div>

                        {/* Jenis Lomba */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="jenis_lomba">Jenis Lomba</Label>
                            <select
                                id="jenis_lomba"
                                name="jenis_lomba"
                                className="h-10 px-3 border rounded-md"
                                onChange={(e) =>
                                    setData("jenis_lomba", e.target.value)
                                }
                            >
                                <option value="">Pilih Jenis Lomba</option>
                                <option value="akademik">Akademik</option>
                                <option value="non-akademik">
                                    Non Akademik
                                </option>
                            </select>
                        </div>

                        {/* Tingkat Lomba */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tingkat_lomba">Tingkat Lomba</Label>
                            <select
                                id="tingkat_lomba"
                                name="tingkat_lomba"
                                className="h-10 px-3 border rounded-md"
                                onChange={(e) =>
                                    setData("tingkat_lomba", e.target.value)
                                }
                            >
                                <option value="">Pilih Tingkat Lomba</option>
                                <option value="internasional">
                                    Internasional
                                </option>
                                <option value="nasional">Nasional</option>
                                <option value="provinsi">Provinsi</option>
                                <option value="lokal-wilayah">
                                    Lokal-Wilayah
                                </option>
                            </select>
                        </div>

                        {/* Model Pelaksanan */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="model_pelaksanaan">
                                Model Pelaksanan
                            </Label>
                            <select
                                id="model_pelaksanaan"
                                name="model_pelaksanaan"
                                className="h-10 px-3 border rounded-md"
                                onChange={(e) =>
                                    setData("model_pelaksanaan", e.target.value)
                                }
                            >
                                <option value="">Pilih Model Pelaksanan</option>
                                <option value="offline">Offline</option>
                                <option value="online">Online</option>
                            </select>
                        </div>

                        {/* Dosen Pembimbing */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="dosen_pembimbing">
                                Dosen Pembimbing
                            </Label>
                            <select
                                id="dosen_pembimbing"
                                name="dosen_pembimbing"
                                className="h-10 px-3 border rounded-md"
                                onChange={(e) =>
                                    setData("dosen_pembimbing", e.target.value)
                                }
                            >
                                <option value="">Input Dosen Pembimbing</option>
                                <option value="SPA">SPA</option>
                                <option value="ATD">ATD</option>
                            </select>
                        </div>

                        {/* Tanggal Mulai */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tanggal_mulai">Tanggal Mulai</Label>
                            <Input
                                id="tanggal_mulai"
                                name="tanggal_mulai"
                                type="date"
                                className="h-10"
                                onChange={(e) =>
                                    setData("tanggal_mulai", e.target.value)
                                }
                            />
                        </div>

                        {/* Tanggal Selesai */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tanggal_selesai">
                                Tanggal Selesai
                            </Label>
                            <Input
                                id="tanggal_selesai"
                                name="tanggal_selesai"
                                type="date"
                                className="h-10"
                                onChange={(e) =>
                                    setData("tanggal_selesai", e.target.value)
                                }
                            />
                        </div>

                        {/* Jenis Kepesertaan */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="jenis_kepesertaan">
                                Jenis Kepesertaan
                            </Label>
                            <select
                                id="jenis_kepesertaan"
                                name="jenis_kepesertaan"
                                className="h-10 px-3 border rounded-md"
                                value={jenisKepesertaan}
                                onChange={handleKepesertaanChange}
                            >
                                <option value="">
                                    Pilih Jenis Kepesertaan
                                </option>
                                <option value="individu">Individu</option>
                                <option value="kelompok">Kelompok</option>
                            </select>
                        </div>

                        {/* Jumlah Peserta */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="jumlah_peserta">
                                Jumlah Peserta
                            </Label>
                            <Input
                                id="jumlah_peserta"
                                name="jumlah_peserta"
                                type="number"
                                className="h-10"
                                value={
                                    jenisKepesertaan === "individu"
                                        ? 1
                                        : anggotaKelompok.length + 1 // User yang daftar masuk sebagai anggota
                                }
                                readOnly
                            />
                        </div>

                        {/* Anggota Kelompok */}
                        {jenisKepesertaan === "kelompok" && (
                            <div className="col-span-2 flex flex-col gap-2">
                                <Label>Anggota Kelompok</Label>
                                {anggotaKelompok.map((anggota, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2"
                                    >
                                        <Input
                                            type="text"
                                            className="h-10 flex-1"
                                            value={anggota}
                                            onChange={(e) =>
                                                handleAnggotaChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Anggota ${index + 1}`}
                                        />
                                        <button
                                            type="button"
                                            className="bg-red-500 text-white px-3 py-1 rounded-md"
                                            onClick={() => removeAnggota(index)}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="mt-2 text-primary font-semibold"
                                    onClick={addAnggota}
                                >
                                    + Tambah Anggota
                                </button>
                            </div>
                        )}

                        {/* Nama Peserta (Individu) */}
                        {jenisKepesertaan === "individu" && (
                            <div className="col-span-2 flex flex-col gap-2">
                                <Label htmlFor="anggota_kelompok">
                                    Nama Peserta
                                </Label>
                                <Input
                                    id="anggota_kelompok"
                                    name="anggota_kelompok"
                                    type="text"
                                    className="h-10"
                                    value={auth.user.name}
                                    readOnly
                                />
                            </div>
                        )}
                        {/* Surat Tugas (File Upload) */}
                        <div className="flex flex-col gap-2 col-span-2">
                            <Label htmlFor="surat_tugas">Surat Tugas</Label>
                            <Input
                                id="surat_tugas"
                                name="surat_tugas"
                                type="file"
                                className="h-10"
                                accept="application/pdf"
                                onChange={(e) =>
                                    setData("surat_tugas", e.target.files[0])
                                }
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-5 py-3">
                        <button type="submit" disabled={processing} className="bg-blue-600 py-2 px-4 text-white rounded-md">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default PengajuanLomba;

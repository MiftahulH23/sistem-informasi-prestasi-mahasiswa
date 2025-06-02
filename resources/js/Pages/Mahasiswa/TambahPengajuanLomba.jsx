import MultiSelect from "@/Components/MultiSelect";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/Components/ui/tooltip";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { CircleHelp } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const PengajuanLomba = ({ auth, dosenList }) => {
    const currentUserId = auth.user.id; // Ambil ID user yang sedang login
    const { kategoriLomba, judulLomba, mahasiswaList } = usePage().props;
    const { flash } = usePage().props;
    const { data, setData, post, processing, reset, errors } = useForm({
        kategorilomba_id: "",
        judul_lomba: "",
        jenis_lomba: "",
        tingkat_lomba: "",
        program_studi: "",
        model_pelaksanaan: "",
        dosen_pembimbing: "",
        tanggal_mulai: "",
        tanggal_selesai: "",
        jenis_kepesertaan: "",
        jumlah_peserta: 1,
        anggota_kelompok: [],
        surat_tugas: null,
    });
    const [flashMessage, setFlashMessage] = useState(flash || "");
    const [selectedKategori, setSelectedKategori] = useState("");
    const [filteredJudul, setFilteredJudul] = useState([]);
    const [jenisKepesertaan, setJenisKepesertaan] = useState("");
    const [anggotaKelompok, setAnggotaKelompok] = useState([]);

    useEffect(() => {
        const kategoriTerpilih = kategoriLomba.find(
            (k) => String(k.kategorilomba_id) === String(selectedKategori)
        );

        if (kategoriTerpilih && kategoriTerpilih.kategori_lomba !== "Umum") {
            const filtered = judulLomba.filter(
                (judul) =>
                    String(judul.kategorilomba_id) === String(selectedKategori)
            );
            setFilteredJudul(filtered);
            setData("judul_lomba", "");
        } else {
            setFilteredJudul([]);
            // setData("judul_lomba", "");
        }
    }, [selectedKategori, judulLomba]);

    const handleKategoriChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedKategori(selectedValue);
        setData("kategorilomba_id", selectedValue);
        if (selectedValue === "Umum") {
            setData("judul_lomba", "");
        }
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();

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
                setSelectedKategori(""); // Reset kategori
                setFilteredJudul([]); // Reset judul
                Swal.fire(
                    "Berhasil!",
                    "Pengajuan berhasil ditambah.",
                    "success"
                );
            },
            onError: (errors) => {
                const message = Object.values(errors)[0];
                Swal.fire("Gagal!", message, "error");
            },
        });
    };
    const breadcrumb = [
        {
            title: "Pengajuan Lomba",
            href: "/pengajuan-lomba",
        },
        {
            title: "Tambah",
            href: "/pengajuan-lomba/create",
        },
    ];
    const [select, setSelect] = useState([]);
    const dataDosen = dosenList.map((dosen) => ({
        value: dosen.id,
        label: dosen.name,
    }));
    const dataMahasiswa = mahasiswaList.map((mahasiswa) => ({
        value: mahasiswa.id,
        label: mahasiswa.name,
    }));
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
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
                            <div className="flex items-center gap-1">
                                <Label htmlFor="kategori_lomba" data-required>
                                    Kategori Lomba
                                </Label>
                                <Tooltip>
                                    <TooltipTrigger type="button">
                                        <CircleHelp
                                            size={14}
                                            aria-hidden="true"
                                            className="text-muted-foreground"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="px-2 py-1 text-xs text-foreground shadow-md max-w-xs">
                                        Pilih "Umum" jika judul lomba belum
                                        tersedia dalam daftar
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <select
                                id="kategorilomba_id"
                                name="kategorilomba_id"
                                onChange={handleKategoriChange}
                                value={selectedKategori}
                            >
                                <option value="" disabled>
                                    Pilih Kategori
                                </option>
                                {kategoriLomba.map((kategori) => (
                                    <option
                                        key={kategori.kategorilomba_id}
                                        value={kategori.kategorilomba_id}
                                    >
                                        {kategori.kategori_lomba}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Judul Lomba */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="judul_lomba" data-required>
                                Judul Lomba
                            </Label>
                            {kategoriLomba.find(
                                (k) =>
                                    String(k.kategorilomba_id) ===
                                    String(selectedKategori)
                            )?.kategori_lomba === "Umum" ? (
                                <Input
                                    id="judul_lomba"
                                    name="judul_lomba"
                                    className="h-10"
                                    onChange={(e) =>
                                        setData("judul_lomba", e.target.value)
                                    }
                                    value={data.judul_lomba}
                                    placeholder="Masukkan Judul Lomba"
                                    required
                                />
                            ) : (
                                <select
                                    id="judul_lomba"
                                    name="judul_lomba"
                                    onChange={(e) =>
                                        setData("judul_lomba", e.target.value)
                                    }
                                    value={data.judul_lomba}
                                    required
                                >
                                    <option value="" disabled>
                                        Pilih Judul
                                    </option>
                                    {filteredJudul.map((judul) => (
                                        <option
                                            key={judul.judullomba_id}
                                            value={judul.judul_lomba}
                                        >
                                            {judul.judul_lomba}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Jenis Lomba */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                                <Label htmlFor="jenis_lomba" data-required>
                                    Jenis Lomba
                                </Label>
                                <Tooltip>
                                    <TooltipTrigger type="button">
                                        <CircleHelp
                                            size={14}
                                            aria-hidden="true"
                                            className="text-muted-foreground"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="px-2 py-1 text-xs text-foreground shadow-md max-w-xs">
                                        Pilih "Non Akademik" untuk lomba yang
                                        tidak berkaitan langsung dengan bidang
                                        studi
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <select
                                id="jenis_lomba"
                                name="jenis_lomba"
                                className="h-10 px-3 border rounded-md"
                                onChange={(e) =>
                                    setData("jenis_lomba", e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    Pilih Jenis Lomba
                                </option>
                                <option value="Akademik">Akademik</option>
                                <option value="Non-Akademik">
                                    Non Akademik
                                </option>
                            </select>
                        </div>

                        {/* Tingkat Lomba */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tingkat_lomba" data-required>
                                Tingkat Lomba
                            </Label>
                            <select
                                id="tingkat_lomba"
                                name="tingkat_lomba"
                                className="h-10 px-3 border rounded-md"
                                onChange={(e) =>
                                    setData("tingkat_lomba", e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    Pilih Tingkat Lomba
                                </option>
                                <option value="Internasional">
                                    Internasional
                                </option>
                                <option value="Nasional">Nasional</option>
                                <option value="Provinsi">Provinsi</option>
                                <option value="Lokal-Wilayah">
                                    Lokal-Wilayah
                                </option>
                            </select>
                        </div>

                        {/* Model Pelaksanan */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="model_pelaksanaan" data-required>
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
                                <option value="" disabled>
                                    Pilih Model Pelaksanan
                                </option>
                                <option value="offline">Offline</option>
                                <option value="online">Online</option>
                            </select>
                        </div>
                        {/* Program Studi */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="program_studi" data-required>
                                Program Studi
                            </Label>
                            <select
                                id="program_studi"
                                name="program_studi"
                                className="h-10 px-3 border rounded-md"
                                onChange={(e) =>
                                    setData("program_studi", e.target.value)
                                }
                            >
                                <option value="" disabled>
                                    Pilih Program Studi
                                </option>
                                <option value="Teknik Elektronika Telekomunikasi">
                                    Teknik Elektronika Telekomunikasi
                                </option>
                                <option value="Teknik Listrik">
                                    Teknik Listrik
                                </option>
                                <option value="Teknik Mesin">
                                    Teknik Mesin
                                </option>
                                <option value="Teknologi Rekayasa Jaringan Telekomunikasi">
                                    Teknologi Rekayasa Jaringan Telekomunikasi
                                </option>
                                <option value="Teknologi Rekayasa Sistem Elektronika">
                                    Teknologi Rekayasa Sistem Elektronika
                                </option>
                                <option value="Teknologi Rekayasa Mekatronika">
                                    Teknologi Rekayasa Mekatronika
                                </option>
                                <option value="Teknik Informatika">
                                    Teknik Informatika
                                </option>
                                <option value="Sistem Informasi">
                                    Sistem Informasi
                                </option>
                                <option value="Teknologi Rekayasa Komputer">
                                    Teknologi Rekayasa Komputer
                                </option>
                                <option value="Akuntansi Perpajakan">
                                    Akuntansi Perpajakan
                                </option>
                                <option value="Hubungan Masyarakat dan Komunikasi Digital">
                                    Hubungan Masyarakat dan Komunikasi Digital
                                </option>
                                <option value="Bisnis Digital">
                                    Bisnis Digital
                                </option>
                            </select>
                        </div>

                        {/* Dosen Pembimbing */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="dosen_pembimbing" data-required>
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
                                <option value="" disabled>
                                    Pilih Dosen
                                </option>
                                {dosenList.map((dosen) => (
                                    <option key={dosen.id} value={dosen.id}>
                                        {dosen.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-muted-foreground text-sm">
                                Catatan: Nama dosen dipilih secara random saja
                            </p>
                        </div>

                        {/* Tanggal Mulai */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tanggal_mulai" data-required>
                                Tanggal Mulai
                            </Label>
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
                            <Label htmlFor="tanggal_selesai" data-required>
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
                            <Label htmlFor="jenis_kepesertaan" data-required>
                                Jenis Kepesertaan
                            </Label>
                            <select
                                id="jenis_kepesertaan"
                                name="jenis_kepesertaan"
                                className="h-10 px-3 border rounded-md"
                                value={jenisKepesertaan}
                                onChange={handleKepesertaanChange}
                            >
                                <option value="" disabled>
                                    Pilih Jenis Kepesertaan
                                </option>
                                <option value="individu">Individu</option>
                                <option value="kelompok">Kelompok</option>
                            </select>
                        </div>

                        {/* Jumlah Peserta */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="jumlah_peserta" data-required>
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
                                <div className="flex items-center gap-1">
                                    <Label data-required>
                                        Anggota Kelompok
                                    </Label>
                                    <Tooltip>
                                        <TooltipTrigger type="button">
                                            <CircleHelp
                                                size={14}
                                                aria-hidden="true"
                                                className="text-muted-foreground"
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent className="px-2 py-1 text-xs text-foreground shadow-md max-w-xs">
                                            Tidak perlu menambahkan nama Anda
                                            sendiri sebagai anggota kelompok
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <div className="flex-1">
                                    <MultiSelect
                                        placeholder="Pilih Anggota Kelompok"
                                        notFoundText="Nama mahasiswa tidak ditemukan"
                                        value={anggotaKelompok}
                                        onChange={(e) => {
                                            setAnggotaKelompok(e);
                                            setData(
                                                "anggota_kelompok",
                                                e.map((item) => item.value)
                                            );
                                        }}
                                        data={dataMahasiswa}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Nama Peserta (Individu) */}
                        {jenisKepesertaan === "individu" && (
                            <div className="col-span-2 flex flex-col gap-2">
                                <Label htmlFor="anggota_kelompok" data-required>
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
                            <div className="flex items-center gap-1">
                                <Label htmlFor="surat_tugas" data-required>
                                    Surat Tugas
                                </Label>
                                <Tooltip>
                                    <TooltipTrigger type="button">
                                        <CircleHelp
                                            size={14}
                                            aria-hidden="true"
                                            className="text-muted-foreground"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="px-2 py-1 text-xs text-foreground shadow-md max-w-xs">
                                        Unggah dalam format PDF, ukuran maksimal
                                        5MB
                                    </TooltipContent>
                                </Tooltip>
                            </div>
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
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 py-2 px-4 text-white rounded-md"
                        >
                            {processing ? "Menyimpan..." : "Tambah"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default PengajuanLomba;

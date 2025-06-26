import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import { use, useEffect, useState } from "react";
import CreatableSelect from "@/Components/Createable";
import Swal from "sweetalert2";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { CircleHelp } from "lucide-react";
import MultiSelect from "@/Components/MultiSelect";

const PengajuanLomba = ({ auth, dosenList }) => {
    const currentUserId = auth.user.id;
    const { kategoriLomba, judulLomba, mahasiswaList } = usePage().props;
    const { flash } = usePage().props;
    console.log("dosenList:", dosenList);
    console.log("mahasiswaList:", mahasiswaList);
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

    const [selectedKategori, setSelectedKategori] = useState("");
    const [filteredJudul, setFilteredJudul] = useState([]);
    const [jenisKepesertaan, setJenisKepesertaan] = useState("");
    const [anggotaKelompok, setAnggotaKelompok] = useState([]);
    const [dosenPembimbing, setDosenPembimbing] = useState([]);

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
            setData("judul_lomba", "");
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
        const formattedValue = value === "individu" ? "Individu" : "Kelompok";
        setJenisKepesertaan(value);
        setData("jenis_kepesertaan", formattedValue);

        if (value === "individu") {
            const peserta = [auth.user.email];
            setAnggotaKelompok(peserta);
            setData("anggota_kelompok", peserta);
            setData("jumlah_peserta", 1);
        } else {
            setAnggotaKelompok([]);
            setData("anggota_kelompok", []);
            setData("jumlah_peserta", 1);
        }
    };

    const addAnggota = () => {
        setAnggotaKelompok([...anggotaKelompok, ""]);
    };

    const removeAnggota = (index) => {
        const newAnggota = anggotaKelompok.filter((_, i) => i !== index);
        setAnggotaKelompok(newAnggota);
        setData("anggota_kelompok", newAnggota);
        setData("jumlah_peserta", newAnggota.length + 1); // Update jumlah peserta
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Perbarui jumlah_peserta sebelum submit
        const jumlah =
            jenisKepesertaan === "individu" ? 1 : anggotaKelompok.length + 1;
        setData("jumlah_peserta", jumlah);

        post(route("pengajuan-lomba.store"), {
            onSuccess: () => {
                reset();
                setJenisKepesertaan("");
                setAnggotaKelompok([]);
                setSelectedKategori("");
                setFilteredJudul([]);
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
        { title: "Pengajuan Lomba", href: "/pengajuan-lomba" },
        { title: "Tambah", href: "/pengajuan-lomba/create" },
    ];

    const dataMahasiswa = mahasiswaList.map((mahasiswa) => ({
        value: mahasiswa.id,
        label: mahasiswa.email,
    }));
    const dataDosen = Array.isArray(dosenList) ? dosenList : [];

    useEffect(() => {
        setData("anggota_kelompok", anggotaKelompok);
        console.log("Anggota Kelompok:", anggotaKelompok);
    }, [anggotaKelompok]);

    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <div className="flex flex-col gap-7">
                <Head title="Pengajuan Lomba" />
                <h1 className="text-2xl font-bold">Pengajuan Lomba</h1>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                                        Pilih 'Umum' jika lomba yang akan
                                        diikuti tidak termasuk dalam daftar
                                        kategori yang telah ditetapkan.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <select
                                id="kategorilomba_id"
                                name="kategorilomba_id"
                                onChange={handleKategoriChange}
                                value={selectedKategori}
                                required
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
                                    value={data.judul_lomba}
                                    onChange={(e) =>
                                        setData("judul_lomba", e.target.value)
                                    }
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
                            <div className="flex items-center gap-2">
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
                                        Pilih 'Non Akademik' untuk lomba yang
                                        tidak berhubungan langsung dengan bidang
                                        program studi.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <select
                                id="jenis_lomba"
                                name="jenis_lomba"
                                className="h-10 px-3 border rounded-md"
                                value={data.jenis_lomba}
                                onChange={(e) =>
                                    setData("jenis_lomba", e.target.value)
                                }
                                required
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
                                value={data.tingkat_lomba}
                                onChange={(e) =>
                                    setData("tingkat_lomba", e.target.value)
                                }
                                required
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

                        {/* Model Pelaksanaan */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="model_pelaksanaan" data-required>
                                Model Pelaksanaan
                            </Label>
                            <select
                                id="model_pelaksanaan"
                                name="model_pelaksanaan"
                                className="h-10 px-3 border rounded-md"
                                value={data.model_pelaksanaan}
                                onChange={(e) =>
                                    setData("model_pelaksanaan", e.target.value)
                                }
                                required
                            >
                                <option value="" disabled>
                                    Pilih Model Pelaksanaan
                                </option>
                                <option value="offline">Offline</option>
                                <option value="online">Online</option>
                            </select>
                        </div>

                        {/* Program Studi */}
                        {/* <div className="flex flex-col gap-2">
                            <Label htmlFor="program_studi" data-required>
                                Program Studi
                            </Label>
                            <select
                                id="program_studi"
                                name="program_studi"
                                className="h-10 px-3 border rounded-md"
                                value={data.program_studi}
                                onChange={(e) =>
                                    setData("program_studi", e.target.value)
                                }
                                required
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
                        </div> */}

                        {/* Dosen Pembimbing */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="dosen_pembimbing" data-required>
                                Dosen Pembimbing
                            </Label>
                            <MultiSelect
                                placeholder="Pilih Dosen Pembimbing"
                                notFoundText="Nama dosen tidak ditemukan"
                                data={dataDosen}
                                value={dosenPembimbing}
                                onChange={(e) => {
                                    setDosenPembimbing(e);
                                    setData(
                                        "dosen_pembimbing",
                                        e.map((item) => item.value)
                                    );
                                }}
                            />
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
                                value={data.tanggal_mulai}
                                onChange={(e) =>
                                    setData("tanggal_mulai", e.target.value)
                                }
                                required
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
                                value={data.tanggal_selesai}
                                onChange={(e) =>
                                    setData("tanggal_selesai", e.target.value)
                                }
                                required
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
                                required
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
                                        : anggotaKelompok.length + 1
                                }
                                readOnly
                            />
                        </div>

                        {/* Anggota Kelompok */}
                        {/* {jenisKepesertaan === "kelompok" && (
                            <div className="col-span-2 flex flex-col gap-2">
                                <Label data-required>Anggota Kelompok</Label>
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
                        )} */}
                        {jenisKepesertaan === "kelompok" && (
                            <div className="col-span-2 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
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
                                            Silakan pilih atau input email
                                            anggota kelompok, tidak perlu
                                            mengisi email pribadi Anda
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                <CreatableSelect
                                    setValue={setAnggotaKelompok}
                                    defaulOptions={dataMahasiswa}
                                    value={anggotaKelompok}
                                />
                                <span className="text-xs text-muted-foreground">
                                    *Jika email belum terdaftar, Anda dapat
                                    menambahkannya dengan memasukkan email
                                    tersebut secara manual.
                                </span>
                            </div>
                        )}

                        {/* Nama Peserta (Individu) */}
                        {jenisKepesertaan === "individu" && (
                            <div className="col-span-2 flex flex-col gap-2">
                                <Label htmlFor="anggota_kelompok" data-required>
                                    Nama Peserta
                                </Label>
                                <CreatableSelect
                                    setValue={setAnggotaKelompok}
                                    defaulOptions={dataMahasiswa}
                                    value={[
                                        {
                                            value: auth.user.id, // ID user
                                            label: auth.user.email, // Email user
                                        },
                                    ]}
                                    isDisabled
                                />
                            </div>
                        )}

                        {/* Surat Tugas */}
                        <div className="flex flex-col gap-2 col-span-2">
                            <div className="flex items-center gap-2">
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
                                        File surat tugas harus dalam format PDF,
                                        ,maksimal ukuran 5MB.
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
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-5 py-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 py-2 px-4 text-white rounded-md hover:cursor-pointer"
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

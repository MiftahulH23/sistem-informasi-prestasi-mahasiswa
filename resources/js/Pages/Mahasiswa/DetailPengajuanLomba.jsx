import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { FaRegFilePdf } from "react-icons/fa6";

const DetailPengajuanLomba = ({ pengajuanLomba, anggotaUser, dosenPembimbing  }) => {
    const { auth } = usePage().props;

    const isKemahasiswaan = auth.user.role === "Kemahasiswaan";
    const breadcrumb = [
        {
            title: "Pengajuan Lomba",
            href: isKemahasiswaan
                ? "/pengajuan-lomba/update"
                : "/pengajuan-lomba",
        },
        {
            title: "Detail",
            href: "/pengajuan-lomba/show/{id}",
        },
    ];
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Detail Pengajuan Lomba" />
            <h1 className="text-2xl font-bold mb-4">Detail Pengajuan Lomba</h1>
            <div className="p-6 w-full bg-white rounded-lg shadow-md">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <strong>Judul Lomba:</strong>{" "}
                        {pengajuanLomba.judul_lomba}
                    </div>
                    <div>
                        <strong>Kategori:</strong>{" "}
                        {pengajuanLomba.kategori
                            ? pengajuanLomba.kategori.kategori_lomba
                            : "Tidak ada kategori"}
                    </div>
                    <div>
                        <strong>Jenis Lomba:</strong>{" "}
                        {pengajuanLomba.jenis_lomba}
                    </div>
                    <div>
                        <strong>Tingkat Lomba:</strong>{" "}
                        {pengajuanLomba.tingkat_lomba}
                    </div>
                    <div>
                        <strong>Model Pelaksanaan:</strong>{" "}
                        {pengajuanLomba.model_pelaksanaan}
                    </div>
                    <div>
                        <strong>Dosen Pembimbing:</strong>{" "}
                        {dosenPembimbing
                            .map((dosen) => dosen.inisial)
                            .join(", ")}
                    </div>

                    <div>
                        <strong>Tanggal Mulai:</strong>{" "}
                        {pengajuanLomba.tanggal_mulai}
                    </div>
                    <div>
                        <strong>Tanggal Selesai:</strong>{" "}
                        {pengajuanLomba.tanggal_selesai}
                    </div>
                    <div>
                        <strong>Jenis Kepesertaan:</strong>{" "}
                        {pengajuanLomba.jenis_kepesertaan}
                    </div>
                    <div>
                        <strong>Jumlah Peserta:</strong>{" "}
                        {pengajuanLomba.jumlah_peserta}
                    </div>
                    <div>
                        <strong>Anggota Kelompok:</strong>{" "}
                        {anggotaUser.length > 0
                            ? anggotaUser.map((anggota, index) => (
                                  <span key={anggota.id}>
                                      {isKemahasiswaan ? (
                                          <a
                                              href="#"
                                              className="text-blue-500 hover:underline"
                                              onClick={() =>
                                                  router.get(
                                                      `/pengajuan-lomba/update/portofolio/${anggota.id}`
                                                  )
                                              }
                                          >
                                              {anggota.name}
                                          </a>
                                      ) : (
                                          <span>{anggota.name}</span>
                                      )}
                                      {index !== anggotaUser.length - 1 && ", "}
                                  </span>
                              ))
                            : "Tidak ada anggota"}
                    </div>
                    <div>
                        <strong>Status:</strong> {pengajuanLomba.status}
                    </div>
                    <div className="flex items-center gap-2">
                        <strong>Surat Tugas:</strong>{" "}
                        {pengajuanLomba.surat_tugas ? (
                            <a
                                href={`/storage/${pengajuanLomba.surat_tugas}`}
                                target="_blank"
                                className=""
                            >
                                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-xl text-sm hover:bg-blue-200 cursor-pointer transition">
                                    <FaRegFilePdf className="w-4 h-4" />
                                    <span>Lihat File</span>
                                </div>
                            </a>
                        ) : (
                            "Tidak ada file"
                        )}
                    </div>
                    <div>
                        <strong>Catatan:</strong>{" "}
                        {pengajuanLomba.catatan
                            ? pengajuanLomba.catatan
                            : "Pengajuan dalam proses"}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DetailPengajuanLomba;

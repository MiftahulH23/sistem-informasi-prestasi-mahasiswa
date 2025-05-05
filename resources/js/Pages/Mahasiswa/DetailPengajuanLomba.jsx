import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";

const DetailPengajuanLomba = ({ pengajuanLomba, anggotaUser }) => {
    const breadcrumb = [
        {
            title: "Pengajuan Lomba",
            href: "/pengajuan-lomba",
        },
        {
            title: "Detail",
            href: "/pengajuan-lomba/show/{id}",
        }
    ]
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
                        {pengajuanLomba.dosen?.name}
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
                                      {index !== anggotaUser.length - 1 && ", "}
                                  </span>
                              ))
                            : "Tidak ada anggota"}
                    </div>
                    <div>
                        <strong>Status:</strong> {pengajuanLomba.status}
                    </div>
                    <div className="">
                        <strong>Surat Tugas:</strong>{" "}
                        {pengajuanLomba.surat_tugas ? (
                            <a
                                href={`/storage/${pengajuanLomba.surat_tugas}`}
                                target="_blank"
                                className="text-blue-500 hover:underline"
                            >
                                Lihat Surat Tugas
                            </a>
                        ) : (
                            "Tidak ada file"
                        )}
                    </div>
                    <div>
                        <strong>Catatan:</strong> {pengajuanLomba.catatan}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default DetailPengajuanLomba;

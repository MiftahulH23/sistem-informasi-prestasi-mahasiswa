import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

const PortofolioLomba = () => {
    const { nama, pengajuans, prestasi = [] } = usePage().props; // Berikan default array kosong

    return (
        <AuthenticatedLayout>
            <Head title={`Portofolio ${nama}`} />
            <h1 className="text-2xl font-bold mb-4">
                Portofolio Lomba: {nama}
            </h1>
            <div className="space-y-4">
                {pengajuans.length > 0 ? (
                    pengajuans.map((pengajuan) => {
                        // Pastikan pengajuan.prestasi ada dan merupakan array
                        const capaianPrestasi =
                            pengajuan.prestasi &&
                            Array.isArray(pengajuan.prestasi)
                                ? pengajuan.prestasi
                                : [];

                        return (
                            <div
                                key={pengajuan.pengajuanlomba_id}
                                className="p-4 bg-white rounded-lg shadow-md"
                            >
                                <h2 className="text-xl font-semibold">
                                    {pengajuan.judul_lomba}
                                </h2>
                                <p>
                                    <strong>Kategori:</strong>{" "}
                                    {pengajuan.kategori
                                        ? pengajuan.kategori.kategori_lomba
                                        : "Tidak ada kategori"}
                                </p>
                                <p>
                                    <strong>Tingkat Lomba:</strong>{" "}
                                    {pengajuan.tingkat_lomba}
                                </p>
                                <p>
                                    <strong>Status:</strong> {pengajuan.status}
                                </p>
                                <div>
                                    <strong>Capaian Prestasi:</strong>
                                    {capaianPrestasi.length > 0 ? (
                                        <ul className="list-disc ml-5">
                                            {capaianPrestasi.map((p) => (
                                                <li key={p.prestasi_id}>
                                                    {p.capaian_prestasi} -{" "}
                                                    {p.status}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Belum ada capaian</p>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-gray-500">
                        {nama} belum memiliki pengajuan lomba.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default PortofolioLomba;

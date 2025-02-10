import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

const DataPengajuanLomba = ({ pengajuanLomba }) => {
    return (
        <AuthenticatedLayout>
            <Head title="Data Pengajuan Lomba" />
            <div className="overflow-x-auto p-4">
                <table className="table">
                    {/* Head */}
                    <thead>
                        <tr className=" text-center">
                            <th className="px-4 py-2">No</th>
                            <th className="px-4 py-2">Kategori Lomba</th>
                            <th className="px-4 py-2">Judul Lomba</th>
                            <th className="px-4 py-2">Jenis Lomba</th>
                            <th className="px-4 py-2">Tingkat Lomba</th>
                            <th className="px-4 py-2">Dosen Pembimbing</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pengajuanLomba.length > 0 ? (
                            pengajuanLomba.map((lomba, index) => (
                                <tr key={lomba.id} className="text-center">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">
                                        {lomba.kategori_lomba}
                                    </td>
                                    <td className="px-4 py-2">
                                        {lomba.judul_lomba}
                                    </td>
                                    <td className="px-4 py-2">
                                        {lomba.jenis_lomba}
                                    </td>
                                    <td className="px-4 py-2">
                                        {lomba.anggota_kelompok.length > 0
                                            ? lomba.anggota_kelompok.join(", ")
                                            : "-"}
                                    </td>

                                    <td className="px-4 py-2">
                                        {lomba.dosen_pembimbing}
                                    </td>
                                    <td
                                        className={`px-4 py-2 text-center 
    ${lomba.status === "Diajukan" ? "text-blue-500" : ""}
    ${lomba.status === "Diterima" ? "text-green-500" : ""}
    ${lomba.status === "Ditolak" ? "text-red-500" : ""}`}
                                    >
                                        {lomba.status}
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
            </div>
        </AuthenticatedLayout>
    );
};

export default DataPengajuanLomba;

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Swal from "sweetalert2";
const DataPengajuanLomba = ({ pengajuanLomba }) => {
    const updateStatus = (id, status) => {
        router.put(`/pengajuan-lomba/${id}/update-status`, { status });
        Swal.fire("Berhasil!", "Status pengajuan berhasil diubah.", "success");
    };

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
                            <th className="px-4 py-2">Anggota</th>
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
                                        {lomba.kategori?.kategori_lomba || "-"}
                                    </td>
                                    <td className="px-4 py-2">
                                        {lomba.judul_lomba}
                                    </td>
                                    <td className="px-4 py-2">
                                        {lomba.jenis_lomba}
                                    </td>
                                    <td className="px-4 py-2">
                                        {Array.isArray(
                                            lomba.anggota_kelompok
                                        ) && lomba.anggota_kelompok.length > 0
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

                                    <td className="px-4 py-2  gap-2 grid place-items-center h-16">
                                        <div className="flex gap-2 items-center justify-center">
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        lomba.id,
                                                        "Diterima"
                                                    )
                                                }
                                                className="bg-blue-500 text-white px-1 rounded size-5"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-check w-full h-full object-cover"
                                                >
                                                    <path d="M20 6 9 17l-5-5" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        lomba.id,
                                                        "Ditolak"
                                                    )
                                                }
                                                className="bg-red-500 text-white px-1 rounded size-5"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-x w-full h-full object-cover"
                                                >
                                                    <path d="M18 6 6 18" />
                                                    <path d="m6 6 12 12" />
                                                </svg>
                                            </button>
                                        </div>
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

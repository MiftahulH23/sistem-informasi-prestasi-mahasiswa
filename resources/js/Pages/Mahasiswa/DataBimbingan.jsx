import { DataTable, DataTableControls } from "@/Components/data-table";
import { DataTableFilter } from "@/Components/data-table/filter";
import { customFilterFns } from "@/Components/data-table/utils";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";

const DataBimbingan = ({ bimbingan }) => {
    const { props } = usePage();
    const id = props.id;
    const columns = [
        {
            id: "Nomor",
            header: "No",
            cell: (info) => info.row.index + 1,
        },
        {
            id: "tanggal",
            accessorKey: "tanggal",
            header: "Tanggal",
        },
        {
            id: "materi_bimbingan",
            accessorKey: "materi_bimbingan",
            header: "Materi Bimbingan",
        },
        {
            id: "catatan_bimbingan",
            accessorKey: "catatan_bimbingan",
            header: "Catatan Bimbingan",
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <div
                        className={`${
                            status === "Diterima"
                                ? "text-green-500"
                                : status === "Diajukan"
                                ? "text-blue-500"
                                : "text-red-500"
                        } font-semibold`}
                    >
                        {status}
                    </div>
                );
            },
            filterFn: customFilterFns["checkbox"],
        },
    ];
    const Status = ["Diajukan", "Diterima", "Ditolak"];
    return (
        <AuthenticatedLayout>
            <Head title="Data Bimbingan" />
            <h1>Data Bimbingan</h1>
            <div className="overflow-x-auto p-4">
                <DataTable columns={columns} data={bimbingan}>
                    {({ table }) => {
                        return (
                            <DataTableControls table={table}>
                                <DataTableFilter
                                    table={table}
                                    extend={[
                                        {
                                            id: "status",
                                            label: "Status",
                                            data: Status,
                                        },
                                    ]}
                                />
                                <button
                                    onClick={() =>
                                        router.get(`/bimbingan/${id}/create`)
                                    }
                                    className="bg-blue-600 py-2 px-4 text-white rounded-md ms-auto"
                                >
                                    Tambah
                                </button>
                            </DataTableControls>
                        );
                    }}
                </DataTable>
            </div>
        </AuthenticatedLayout>
    );
};

export default DataBimbingan;

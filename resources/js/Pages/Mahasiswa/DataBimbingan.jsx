import { DataTable, DataTableControls } from "@/Components/data-table";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { id } from "date-fns/locale";
import React from "react";

const DataBimbingan = ({ bimbingan }) => {
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
        }
    ];
    return (
        <AuthenticatedLayout>
            <Head title="Data Bimbingan" />
            <h1>Data Bimbingan</h1>
            <div className="overflow-x-auto p-4">
                <DataTable columns={columns} data={bimbingan}>
                    {({ table }) => {
                        return (
                            <DataTableControls
                                table={table}
                            ></DataTableControls>
                        );
                    }}
                </DataTable>
            </div>
        </AuthenticatedLayout>
    );
};

export default DataBimbingan;

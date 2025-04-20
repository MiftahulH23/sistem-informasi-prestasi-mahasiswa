// ExportButton.js
import React from "react";
import {FileSpreadsheet} from "lucide-react";
const ExportButton = ({ table }) => {
    const handleExport = () => {
        const filters = table.getState().columnFilters;
        const params = new URLSearchParams();

        filters.forEach((filter) => {
            if (Array.isArray(filter.value)) {
                filter.value.forEach((val) =>
                    params.append(`${filter.id}[]`, val)
                );
            } else if (filter.value) {
                params.append(filter.id, filter.value);
            }
        });

        const exportUrl = `/export-prestasi?${params.toString()}`;
        window.open(exportUrl, "_blank"); // <-- Ini harusnya buka tab dan langsung download
    };

    return (
        <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
        >
            <FileSpreadsheet className="mr-2" size={16} />
            Excel
        </button>
    );
};

export default ExportButton;

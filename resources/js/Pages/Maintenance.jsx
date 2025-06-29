import React from "react";
import PageMaintenance from "@/Components/PageMaintenance";
import { Head } from "@inertiajs/react";
const Maintenance = () => {
    return (
        <div className="flex w-full h-screen justify-center items-center">
            <Head title="Maintenance" />
            <PageMaintenance />
        </div>
    );
};

export default Maintenance;

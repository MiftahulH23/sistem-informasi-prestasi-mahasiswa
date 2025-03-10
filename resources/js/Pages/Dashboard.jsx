import { BarChartComponent } from "@/Components/BarChartComponent";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Dashboard({chartData}) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <BarChartComponent chartData={chartData} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

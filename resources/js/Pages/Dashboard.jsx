import { BarChartComponent } from "@/Components/BarChartComponent";
import LineChartComponent from "@/Components/LineChartComponent";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { BarChartVertikal } from "@/Components/BarChartVertikal";

export default function Dashboard({ chartData, lineChartData, TingkatLomba }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <LineChartComponent lineChartData={lineChartData} />
                    <BarChartComponent
                        chartData={chartData}
                        className="w-full"
                    />
                    <BarChartVertikal TingkatLomba={TingkatLomba}  />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

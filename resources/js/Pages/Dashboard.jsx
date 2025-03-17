import { BarChartComponent } from "@/Components/BarChartComponent";
import LineChartComponent from "@/Components/LineChartComponent";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { BarChartVertikal } from "@/Components/BarChartVertikal";

export default function Dashboard({ chartData, lineChartData, TingkatLomba }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <h1>Dashboard</h1>
            <div>
                <div className="h-72">
                    <LineChartComponent
                        lineChartData={lineChartData}
                        className="h-full"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                    <BarChartComponent
                        chartData={chartData}
                        className="w-full"
                    />
                    <BarChartVertikal TingkatLomba={TingkatLomba} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

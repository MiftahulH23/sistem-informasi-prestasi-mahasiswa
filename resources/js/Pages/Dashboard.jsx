import { BarChartComponent } from "@/Components/BarChartComponent";
import LineChartComponent from "@/Components/LineChartComponent";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { BarChartVertikal } from "@/Components/BarChartVertikal";
import { PieChartComponent } from "@/Components/PieChartComponent";

export default function Dashboard({ chartData, lineChartData, TingkatLomba, KategoriLomba }) {
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    <BarChartComponent
                        chartData={chartData}
                        className="w-full"
                    />
                    <BarChartVertikal TingkatLomba={TingkatLomba} />
                    <PieChartComponent KategoriLomba={KategoriLomba} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

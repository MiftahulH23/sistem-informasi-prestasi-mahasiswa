import { BarChartComponent } from "@/Components/BarChartComponent";
import LineChartComponent from "@/Components/LineChartComponent";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { BarChartVertikal } from "@/Components/BarChartVertikal";
import { PieChartComponent } from "@/Components/PieChartComponent";
import DashboardCard from "@/Components/DashboardCard";
import { FileCheck2, Trophy, Award } from "lucide-react";
export default function Dashboard({
    chartData,
    lineChartData,
    TingkatLomba,
    KategoriLomba,
    total_pengajuan,
    total_prestasi,
    persentase_prestasi,
}) {
    const breadcrumb = [
        {
            title: "Dashboard",
            href: "/dashboard",
        },
    ]
    return (
        <AuthenticatedLayout breadcrumbs={breadcrumb}>
            <Head title="Dashboard" />
            <h1>Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <DashboardCard
                    title="Total Pengajuan Lomba"
                    total={total_pengajuan}
                    icon={<FileCheck2 size={32} />}
                />
                <DashboardCard
                    title="Total Prestasi"
                    total={total_prestasi}
                    icon={<Trophy size={32} />}
                />
                <DashboardCard
                    title="Persentase Perolehan Prestasi"
                    total={`${persentase_prestasi}%`}
                    icon={<Award size={32} />}
                />
            </div>
            <div className="h-72">
                <LineChartComponent
                    lineChartData={lineChartData}
                    className="h-full"
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <BarChartComponent chartData={chartData} className="w-full" />
                <BarChartVertikal TingkatLomba={TingkatLomba} />
                <PieChartComponent KategoriLomba={KategoriLomba} />
            </div>
        </AuthenticatedLayout>
    );
}

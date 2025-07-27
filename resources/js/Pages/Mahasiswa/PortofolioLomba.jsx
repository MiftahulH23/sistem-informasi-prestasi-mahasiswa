import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useMemo } from "react";

import {
    Bar,
    BarChart,
    Pie,
    PieChart,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import DashboardCard from "@/Components/DashboardCard";
import { Award, FileCheck2, Trophy } from "lucide-react";

const PortofolioLomba = () => {
    const { nama, pengajuans } = usePage().props;

    // --- KALKULASI DATA ---

    // 1. Kalkulasi untuk 3 kartu ringkasan
    const summaryStats = useMemo(() => {
        const totalLomba = pengajuans.length;
        const totalPrestasiDiraih = pengajuans
            .flatMap(p => p.prestasi.filter(prestasi => prestasi.status === 'Diterima'))
            .filter(p => p.capaian_prestasi !== 'Peserta')
            .length;
        const rasioKemenangan = totalLomba > 0 ? (totalPrestasiDiraih / totalLomba) * 100 : 0;
        return {
            totalLomba,
            totalPrestasiDiraih,
            rasioKemenangan: rasioKemenangan.toFixed(0) + "%",
        };
    }, [pengajuans]);

    // 2. [PERUBAHAN] Data & Config untuk Chart Tingkat Lomba
    const dataLombaPerTingkat = useMemo(() => {
        // Definisikan master list label yang berurutan
        const allTingkatLombaLabels = [
            "Internasional",
            "Nasional",
            "Provinsi",
            "Lokal-Wilayah",
        ];

        // Hitung jumlah lomba yang dimiliki pengguna
        const actualCounts = pengajuans.reduce((acc, pengajuan) => {
            const tingkat = pengajuan.tingkat_lomba;
            if (tingkat) {
                acc[tingkat] = (acc[tingkat] || 0) + 1;
            }
            return acc;
        }, {});

        // Petakan master list ke data chart, gunakan count yang ada atau 0
        return allTingkatLombaLabels.map(label => ({
            name: label,
            total: actualCounts[label] || 0,
        }));
    }, [pengajuans]);

    const barChartTingkatConfig = {
        total: { label: "Total Lomba", color: "hsl(var(--chart-1))" },
    };

    // 3. Data & Config untuk Chart Distribusi Kategori Lomba
    const dataLombaPerKategori = useMemo(() => {
        const counts = pengajuans.reduce((acc, pengajuan) => {
            const kategori = pengajuan.kategori?.kategori_lomba || "Tidak Ada Kategori";
            acc[kategori] = (acc[kategori] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(counts).map((kategori, index) => ({
            name: kategori,
            value: counts[kategori],
            fill: `hsl(var(--chart-${(index % 5) + 1}))`,
        }));
    }, [pengajuans]);

    const pieChartConfig = useMemo(() => {
        if (!dataLombaPerKategori.length) return {};
        return dataLombaPerKategori.reduce((acc, category) => {
            acc[category.name] = { label: category.name, color: category.fill };
            return acc;
        }, {});
    }, [dataLombaPerKategori]);

    // 4. Data & Config untuk Chart Capaian Prestasi
    const dataCapaianPrestasi = useMemo(() => {
        const allCapaianPrestasiLabels = [
            "Juara 1", "Juara 2", "Juara 3",
            "Harapan 1", "Harapan 2", "Harapan 3",
            "Peserta",
        ];
        const allPrestasi = pengajuans.flatMap(p =>
            p.prestasi.filter(prestasi => prestasi.status === 'Diterima')
        );
        const actualCounts = allPrestasi.reduce((acc, prestasi) => {
            const capaian = prestasi.capaian_prestasi;
            if (capaian) {
                acc[capaian] = (acc[capaian] || 0) + 1;
            }
            return acc;
        }, {});
        return allCapaianPrestasiLabels.map(label => ({
            name: label,
            total: actualCounts[label] || 0,
        }));
    }, [pengajuans]);

    const barChartPrestasiConfig = {
        total: { label: "Jumlah", color: "hsl(var(--chart-3))" },
    };

    // 5. Data & Config untuk Chart Jenis Lomba
    const dataJenisLomba = useMemo(() => {
        const counts = pengajuans.reduce((acc, pengajuan) => {
            const jenis = pengajuan.jenis_lomba || "Tidak Diketahui";
            acc[jenis] = (acc[jenis] || 0) + 1;
            return acc;
        }, {});
        return Object.keys(counts).map((jenis) => ({
            name: jenis,
            total: counts[jenis],
        }));
    }, [pengajuans]);

    const barChartJenisConfig = {
        total: { label: "Jumlah Lomba", color: "hsl(var(--chart-3))" },
    };


    // --- TAMPILAN (JSX) ---
    return (
        <AuthenticatedLayout breadcrumbs={[]}>
            <Head title={`Portofolio ${nama}`} />
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-6">
                    Portofolio Lomba: {nama}
                </h1>

                 {/* Bagian Kartu Ringkasan */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <DashboardCard title="Total Lomba yang diikuti" total={summaryStats.totalLomba} icon={<FileCheck2 size={32}/>} />
                    <DashboardCard title="Total Prestasi Diraih" total={summaryStats.totalPrestasiDiraih} icon={<Trophy size={32}/>} />
                    <DashboardCard title="Persentase Kemenangan" total={summaryStats.rasioKemenangan} icon={<Award size={32}/>} />
                </div>

                {/* Bagian Chart */}
                {pengajuans.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Chart Capaian Prestasi (Full Width) */}
                        <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">
                                Capaian Prestasi
                            </h2>
                            <ChartContainer config={barChartPrestasiConfig} className="h-[250px] w-full">
                                <BarChart data={dataCapaianPrestasi}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis allowDecimals={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="total" fill="var(--color-total)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        </div>

                        {/* Chart Jenis Lomba */}
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Jenis Lomba</h2>
                            <ChartContainer config={barChartJenisConfig} className="min-h-[300px] w-full">
                                <BarChart data={dataJenisLomba}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis allowDecimals={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="total" fill="var(--color-total)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        </div>

                        {/* Chart Distribusi Kategori */}
                        <div className="p-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Distribusi Kategori Lomba</h2>
                            <ChartContainer config={pieChartConfig} className="min-h-[300px] w-full flex items-center justify-center">
                                <PieChart>
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Pie data={dataLombaPerKategori} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} />
                                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                                </PieChart>
                            </ChartContainer>
                        </div>

                        {/* Chart Tingkat Lomba */}
                        <div className="p-6 bg-white rounded-lg shadow-md col-span-2">
                            <h2 className="text-xl font-semibold mb-4">Tingkat Lomba</h2>
                            <ChartContainer config={barChartTingkatConfig} className="h-[250px] w-full">
                                <BarChart data={dataLombaPerTingkat}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                                    <YAxis allowDecimals={false} />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="total" fill="var(--color-total)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 mt-8 text-center">
                        {nama} belum memiliki portofolio lomba dengan prestasi yang sudah diterima.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default PortofolioLomba;
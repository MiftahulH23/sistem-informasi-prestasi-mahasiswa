import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/Components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

export function BarChartComponent({ chartData }) {
    // Konfigurasi warna untuk shadcn chart
    const chartConfig = {
        total: {
            label: "Total Prestasi",
            color: "hsl(var(--chart-1))",
        },
    };
    const prodiMapping = {
        SI: "Sistem Informasi",
        TI: "Teknik Informatika",
        TRK: "Teknologi Rekayasa Komputer",
        TET: "Teknik Elektronika Telekomunikasi",
        TL: "Teknik Listrik",
        TM: "Teknik Mesin",
        TRJT: "Teknologi Rekayasa Jaringan Telekomunikasi",
        TRSE: "Teknologi Rekayasa Sistem Elektronika",
        TRM: "Teknologi Rekayasa Mekatronika",
        AktP: "Akuntansi Perpajakan",
        HMKD: "Hubungan Masyarakat dan Komunikasi Digital",
        BD: "Bisnis Digital",
    };

    return (
        <Card>
            <CardHeader>
                <CardDescription>
                    <p className="text-primary font-semibold">
                        Jumlah Prestasi Prodi
                    </p>
                    <soan className="text-xs">Tahun {new Date().getFullYear()}</soan>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-72 w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ left: -20, right: 25 }}
                    >
                        <XAxis type="number" dataKey="total" hide />
                        <YAxis
                            dataKey="program_studi"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            width={70}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(label) =>
                                        prodiMapping[label] || label
                                    }
                                />
                            }
                        />

                        <Bar
                            dataKey="total"
                            fill="#2D9CDB"
                            radius={5}
                            className="h-5"
                        >
                            <LabelList
                                dataKey="total"
                                position="right"
                                style={{
                                    fill: "var(--foreground)",
                                    fontSize: 12,
                                }}
                                formatter={(value) => (value > 0 ? value : "")} // Menyembunyikan label jika nilai 0
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

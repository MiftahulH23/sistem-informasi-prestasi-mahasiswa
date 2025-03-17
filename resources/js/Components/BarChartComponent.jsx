import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export function BarChartComponent({ chartData }) {
    // Konfigurasi warna untuk shadcn chart
    const chartConfig = {
        total: {
            label: "Total Prestasi",
            color: "hsl(var(--chart-1))",
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardDescription>
                    <p className="text-primary font-semibold">Jumlah Prestasi Prodi</p>
                    <p className="text-xs">
                    Tahun {new Date().getFullYear()}
                    </p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-72 w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{ left: -20 }}
                    >
                        <XAxis type="number" dataKey="total" hide />
                        <YAxis
                            dataKey="program_studi"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Bar dataKey="total" fill="#2D9CDB" radius={5} className="h-5" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

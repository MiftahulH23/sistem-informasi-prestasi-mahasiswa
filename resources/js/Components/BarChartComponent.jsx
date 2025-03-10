import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
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
            label: "Jumlah Pengajuan",
            color: "hsl(var(--chart-1))",
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardDescription>
                    Data Pengajuan Lomba 1 Tahun Terakhir
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
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
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="total" fill="#2563eb" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Menampilkan jumlah pengajuan lomba dalam satu tahun terakhir
                </div>
            </CardFooter>
        </Card>
    );
}

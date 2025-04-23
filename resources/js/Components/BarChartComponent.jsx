import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/Components/ui/card";
import { ChartContainer, ChartTooltip } from "@/Components/ui/chart";

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
                    <p className="text-primary font-semibold">
                        Jumlah Prestasi Prodi
                    </p>
                    <p className="text-xs">Tahun {new Date().getFullYear()}</p>
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
                        />
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const { payload: data } = payload[0];
                                    return (
                                        <div className="rounded-md border bg-background p-2 shadow-sm">
                                            <p className="text-sm font-semibold text-foreground">
                                                {data.nama_lengkap}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Jumlah Prestasi: {data.total}
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
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
                                formatter={(value) => value > 0 ? value : ""} // Menyembunyikan label jika nilai 0
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}


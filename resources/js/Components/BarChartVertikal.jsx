"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

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

export function BarChartVertikal({ TingkatLomba }) {
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
                        Tingkat Prestasi
                    </p>
                    <p className="text-xs">Tahun {new Date().getFullYear()}</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-72 w-full">
                    <BarChart
                        accessibilityLayer
                        data={TingkatLomba}
                        margin={{ top: 20, right: 5, left: 25, bottom: 35 }} // Menambahkan margin
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tingkat_lomba"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            className="text-[10px]"
                            angle={-45}
                            textAnchor="end"
                            padding={{ left: 20, right: 20 }} // Menambah padding di sumbu X
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="total"
                            fill="#2D9CDB"
                            radius={5}
                            barSize={30}
                        >
                            <LabelList
                                dataKey="total"
                                position="top"
                                style={{
                                    fill: "var(--foreground)",
                                    fontSize: 12,
                                }}
                            />
                        </Bar>{" "}
                        {/* Adjusting the bar size */}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

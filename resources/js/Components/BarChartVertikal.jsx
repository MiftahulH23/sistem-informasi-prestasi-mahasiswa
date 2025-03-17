"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
                    <p className="text-xs">Dalam 1 Tahun Terakhir</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={TingkatLomba}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tingkat_lomba"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="total"
                            fill="#2D9CDB"
                            radius={5}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

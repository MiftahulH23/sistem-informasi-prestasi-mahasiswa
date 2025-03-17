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
                    <p className="text-xs">Tahun {new Date().getFullYear()}</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-72 w-full">
                    <BarChart accessibilityLayer data={TingkatLomba}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tingkat_lomba"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            className="text-xs"
                            
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent  />}
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

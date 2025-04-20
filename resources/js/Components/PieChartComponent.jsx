"use client";

import { Cell, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader
} from "@/Components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/Components/ui/chart";

const chartConfig = {
    total: {
        label: "Total Prestasi",
        color: "hsl(var(--chart-1))",
    },
};

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF1919",
]; 

export function PieChartComponent({ KategoriLomba }) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-0">
                <CardDescription>
                    <p className="text-primary font-semibold">
                        Kategori Lomba
                    </p>
                    <p className="text-xs">Tahun {new Date().getFullYear()}</p>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
                >
                    <PieChart>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent nameKey="kategori_lomba" />
                            }
                        />
                        <Pie
                            data={KategoriLomba}
                            dataKey="total"
                            nameKey="kategori_lomba"
                           
                            fill="#8884d8"
                        >
                            {KategoriLomba.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                            {/* <LabelList
                                dataKey="kategori_lomba"
                                className="font-semibold"
                                fill="#FFFFFF" // Warna teks putih
                                stroke="none"
                                fontSize={12}
                                position="inside" // Posisi label di dalam potongan
                            /> */}
                        </Pie>
                    </PieChart>
                </ChartContainer>
                <div className="mt-4 flex flex-wrap justify-end">
                    {KategoriLomba.map((entry, index) => (
                        <div
                            key={`label-${index}`}
                            className="flex items-center mr-4 mb-2"
                        >
                            <div
                                className="w-3 h-3 mr-2"
                                style={{
                                    backgroundColor:
                                        COLORS[index % COLORS.length],
                                }}
                            ></div>
                            <span className="text-sm">
                                {entry.kategori_lomba}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

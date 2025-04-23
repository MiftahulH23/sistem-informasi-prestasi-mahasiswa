import { CartesianGrid, Line, LineChart, XAxis, YAxis, LabelList } from "recharts";

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
    Akademik: {
        label: "Akademik",
        color: "hsl(var(--chart-1))",
    },
    NonAkademik: {
        label: "Non-Akademik",
        color: "hsl(var(--chart-2))",
    },
};

export default function LineChartComponent({ lineChartData }) {
    return (
        <Card>
            <CardHeader>
                <CardDescription>
                    <p className="text-primary font-semibold">
                        Prestasi Akademik dan Non-Akademik
                    </p>
                    <p className="text-xs">Tahun {new Date().getFullYear()}</p>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-40 w-full">
                    <LineChart
                        accessibilityLayer
                        data={lineChartData}
                        className="w-full"
                        margin={{ left: -20 }}
                    >
                        <CartesianGrid vertical={false} className="w-full" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={true}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)} // Format bulan (3 karakter pertama)
                        />
                        <YAxis
                            domain={[0, 10]}
                            tickCount={11} // Total tick dari 0, 10, 20, ..., 100 (11 titik)
                            tickFormatter={(value) => Math.round(value)} // Pastikan nilai tanpa koma
                            allowDataOverflow={false}
                            tickLine={false}
                            axisLine={true}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Line
                            dataKey="Akademik"
                            type="monotone"
                            stroke="var(--color-Akademik)"
                            strokeWidth={2}
                            dot={false}
                        >
                            {/* Menampilkan label untuk setiap titik data */}
                            <LabelList
                                dataKey="Akademik"
                                position="bottom"
                                fontSize={12}
                                fill="var(--color-Akademik)"
                                offset={-10}
                                formatter={(value) => value > 0 ? value : ""}
                            />
                        </Line>
                        <Line
                            dataKey="Non-Akademik"
                            type="monotone"
                            stroke="var(--color-NonAkademik)"
                            strokeWidth={2}
                            dot={false}
                        >
                            {/* Menampilkan label untuk setiap titik data */}
                            <LabelList
                                dataKey="Non-Akademik"
                                position="bottom"
                                fontSize={12}
                                fill="var(--color-NonAkademik)"
                                offset={-10}
                                formatter={(value) => value > 0 ? value : ""}
                            />
                        </Line>
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}

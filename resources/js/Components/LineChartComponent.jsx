import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

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
    ChartTooltipContent
} from "@/components/ui/chart";

const chartConfig = {
  Akademik: {
    label: "Akademik",
    color: "hsl(var(--chart-1))",
  },
  NonAkademik: {
    label: "Non-Akademik",
    color: "hsl(var(--chart-2))",
  },
}

export default function LineChartComponent({ lineChartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Prestasi</CardTitle>
        <CardDescription>Jumlah prestasi Akademik dan Non-Akademik per bulan</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={lineChartData}
            margin={{ top: 20, right: 12, left: 12, bottom: 20 }} // Tambahkan margin
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)} // Format bulan (3 karakter pertama)
            />
            <YAxis
              domain={[0, 10]} // Atur domain dari 0 hingga 10
              tickCount={6} // Jumlah tick (0, 2, 4, 6, 8, 10)
              tickFormatter={(value) => Math.round(value)} // Format nilai tanpa koma
              allowDataOverflow={false}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="Akademik"
              type="monotone"
              stroke="var(--color-Akademik)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="Non-Akademik"
              type="monotone"
              stroke="var(--color-NonAkademik)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total achievements for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
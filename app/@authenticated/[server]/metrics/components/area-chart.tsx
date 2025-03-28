'use client';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { MetricDatapoint } from '@aws-sdk/client-lightsail';

const chartConfig = {
  data: {
    label: 'Data',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type MetricsAreaChartProps = {
  title: string;
  description: string;
  data: MetricDatapoint[];
};

export const MetricsAreaChart = ({
  title,
  description,
  data,
}: MetricsAreaChartProps) => (
  <Card className="gap-3 border-none p-0 shadow-none">
    <CardHeader className="p-0">
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="rounded-lg border p-4">
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
            }}
          />
          <YAxis
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel />}
          />
          <Area
            dataKey="maximum"
            type="linear"
            className="fill-primary stroke-primary"
            fillOpacity={0.4}
            name="CPU"
          />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

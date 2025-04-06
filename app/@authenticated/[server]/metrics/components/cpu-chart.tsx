import { lightsail } from '@/lib/lightsail';
import { GetInstanceMetricDataCommand } from '@aws-sdk/client-lightsail';
import { MetricsAreaChart } from './area-chart';

type ServerProps = {
  instanceName: string;
  endTime: Date;
  startTime: Date;
  period: number;
};

export const CpuChart = async ({
  instanceName,
  endTime,
  startTime,
  period,
}: ServerProps) => {
  const data = await lightsail.send(
    new GetInstanceMetricDataCommand({
      instanceName,
      endTime,
      metricName: 'CPUUtilization',
      period,
      startTime,
      unit: 'Percent',
      statistics: ['Maximum'],
    })
  );

  return (
    <MetricsAreaChart
      title="CPU Utilization"
      description="Showing CPU usage over time"
      data={data.metricData ?? []}
    />
  );
};

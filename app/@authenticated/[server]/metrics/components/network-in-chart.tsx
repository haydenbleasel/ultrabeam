import { lightsail } from '@/lib/lightsail';
import { GetInstanceMetricDataCommand } from '@aws-sdk/client-lightsail';
import { MetricsAreaChart } from './area-chart';

type ServerProps = {
  instanceName: string;
  endTime: Date;
  startTime: Date;
  period: number;
};

export const NetworkInChart = async ({
  instanceName,
  endTime,
  startTime,
  period,
}: ServerProps) => {
  const data = await lightsail.send(
    new GetInstanceMetricDataCommand({
      instanceName,
      endTime,
      metricName: 'NetworkIn',
      period,
      startTime,
      unit: 'Bytes',
      statistics: ['Sum'],
    })
  );

  return (
    <MetricsAreaChart
      title="Network In"
      description="Showing network in usage over time"
      data={data.metricData ?? []}
    />
  );
};

import { lightsail } from '@/lib/lightsail';
import { GetInstanceMetricDataCommand } from '@aws-sdk/client-lightsail';
import { MetricsAreaChart } from './area-chart';

type ServerProps = {
  instanceName: string;
  endTime: Date;
  startTime: Date;
  period: number;
};

export const NetworkOutChart = async ({
  instanceName,
  endTime,
  startTime,
  period,
}: ServerProps) => {
  const data = await lightsail.send(
    new GetInstanceMetricDataCommand({
      instanceName,
      endTime,
      metricName: 'NetworkOut',
      period,
      startTime,
      unit: 'Bytes',
      statistics: ['Sum'],
    })
  );

  return (
    <MetricsAreaChart
      title="Network Out"
      description="Showing network out usage over time"
      data={data.metricData ?? []}
    />
  );
};

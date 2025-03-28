import { lightsail } from '@/lib/lightsail';
import {
  GetInstanceMetricDataCommand,
  type InstanceMetricName,
} from '@aws-sdk/client-lightsail';
import { MetricsAreaChart } from './components/area-chart';

type ServerProps = {
  params: Promise<{
    server: string;
  }>;
};

const metrics: InstanceMetricName[] = [
  'CPUUtilization',
  'NetworkIn',
  'NetworkOut',
];

const MetricsPage = async ({ params }: ServerProps) => {
  const instanceName = (await params).server;
  const endTime = new Date();
  const startTime = new Date(Date.now() - 1000 * 60 * 60 * 24); // since yesterday
  const period = 60; // 1 minute

  const [cpu, networkIn, networkOut] = await Promise.all(
    metrics.map(async (metricName) => {
      const metrics = await lightsail.send(
        new GetInstanceMetricDataCommand({
          instanceName,
          endTime,
          metricName,
          period,
          startTime,
          unit: 'Percent',
          statistics: ['Maximum'],
        })
      );

      return metrics;
    })
  );

  return (
    <div className="grid gap-6 p-6">
      <MetricsAreaChart
        title="CPU Utilization"
        description="Showing CPU usage over time"
        data={cpu.metricData ?? []}
      />
      <MetricsAreaChart
        title="Network In"
        description="Showing network in usage over time"
        data={networkIn.metricData ?? []}
      />
      <MetricsAreaChart
        title="Network Out"
        description="Showing network out usage over time"
        data={networkOut.metricData ?? []}
      />
    </div>
  );
};

export default MetricsPage;

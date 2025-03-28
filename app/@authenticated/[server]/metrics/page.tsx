import { lightsail } from '@/lib/lightsail';
import {
  GetInstanceMetricDataCommand,
  type InstanceMetricName,
} from '@aws-sdk/client-lightsail';

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
    <div className="p-4">
      <h1 className="font-bold text-2xl">Metrics</h1>
      <pre>{JSON.stringify(cpu.metricData, null, 2)}</pre>
      <pre>{JSON.stringify(networkIn.metricData, null, 2)}</pre>
      <pre>{JSON.stringify(networkOut.metricData, null, 2)}</pre>
    </div>
  );
};

export default MetricsPage;

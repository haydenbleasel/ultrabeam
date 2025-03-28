import { Provisioning } from '../../[server]/components/provisioning';
import { Console } from '../../[server]/console/components/console';

type DeployingServerProps = {
  serverId: string;
};

export const DeployingServer = ({ serverId }: DeployingServerProps) => (
  <div className="grid gap-2">
    <Console defaultValue="" serverId={serverId} />
    <Provisioning id={serverId} />
  </div>
);

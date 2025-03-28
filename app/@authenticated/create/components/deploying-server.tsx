import { Console } from '../../[server]/console/components/console';

type DeployingServerProps = {
  serverId: string;
};

export const DeployingServer = ({ serverId }: DeployingServerProps) => (
  <div className="grid gap-2 divide-x">
    <Console defaultValue="" serverId={serverId} />
  </div>
);

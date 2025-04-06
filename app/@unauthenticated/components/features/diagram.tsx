'use client';

import { Badge } from '@/components/ui/badge';
import { Lock, ServerIcon, ShieldIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Diagram = () => {
  const [animationActive, setAnimationActive] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    setAnimationActive(true);

    // Set up animation cycle
    const interval = setInterval(() => {
      setAnimationActive(false);
      setTimeout(() => setAnimationActive(true), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex h-full flex-col items-center justify-between gap-8 md:flex-row">
      {/* Ultrabeam Platform */}
      <div className="flex h-full w-full items-center justify-center rounded-xl border md:w-56">
        <div className="flex flex-col items-center p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground text-lg">
            Ultrabeam
          </h3>
          <Badge variant="outline" className="mt-2">
            Client
          </Badge>
        </div>
      </div>

      {/* Connection Animation */}
      <div className="relative flex h-16 w-full items-center justify-center md:w-[40%]">
        {/* SSH Connection Line */}
        <div className="-translate-y-1/2 absolute top-1/2 right-0 left-0 h-1 transform rounded-full bg-primary/30" />

        {/* Animated Particles */}
        {animationActive && (
          <>
            <div className="absolute top-1/2 h-3 w-3 animate-[ssh-particle_1.5s_linear_infinite] rounded-full bg-primary" />
            <div className="absolute top-1/2 h-3 w-3 animate-[ssh-particle_1.5s_linear_0.5s_infinite] rounded-full bg-primary" />
            <div className="absolute top-1/2 h-3 w-3 animate-[ssh-particle_1.5s_linear_1s_infinite] rounded-full bg-primary" />
          </>
        )}

        {/* Lock Icon */}
        <div
          className={`-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-10 transform rounded-full border-2 bg-background p-2 ${animationActive ? 'border-primary' : 'border-muted'} transition-colors duration-300`}
        >
          <Lock
            className={`h-5 w-5 ${animationActive ? 'text-primary' : 'text-muted-foreground'} transition-colors duration-300`}
          />
        </div>

        {/* Connection Label */}
        <div className="-translate-x-1/2 absolute bottom-[-20px] left-1/2 transform font-medium text-muted-foreground text-xs">
          Encrypted SSH
        </div>
      </div>

      {/* AWS Lightsail Servers */}
      <div className="flex h-full w-full items-center justify-center rounded-xl border md:w-56">
        <div className="flex flex-col items-center p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ServerIcon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 font-semibold text-foreground text-lg">
            AWS Lightsail
          </h3>
          <Badge variant="outline" className="mt-2">
            Server
          </Badge>
        </div>
      </div>
    </div>
  );
};

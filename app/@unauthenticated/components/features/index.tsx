import { Deployments } from './deployments';
import { Diagram } from './diagram';
import { Speedometer } from './speedometer';

export const Features = () => (
  <div className="grid gap-8">
    <div className="grid gap-6">
      <h2 className="mt-2 max-w-lg text-pretty font-semibold text-4xl text-foreground tracking-tight sm:text-5xl">
        Powerful game servers at your fingertips
      </h2>
      <p className="text-lg text-muted-foreground">
        Powered by AWS Lightsail infrastructure, Ultrabeam is a game server
        management platform that allows you to deploy, manage, and scale your
        game servers with ease.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="relative">
        <div className="absolute inset-px rounded-lg bg-background max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
          <div className="relative aspect-[3/2] w-full overflow-hidden p-10">
            <Speedometer />
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/100" />
          </div>
          <div className="p-10 pt-4">
            <h3 className="font-semibold text-primary text-sm/4">
              Performance
            </h3>
            <p className="mt-2 font-medium text-foreground text-lg tracking-tight">
              Lag-free gaming experience
            </p>
            <p className="mt-2 max-w-lg text-muted-foreground text-sm/6">
              Our optimized servers deliver smooth gameplay for even the most
              demanding titles like Valheim and Palworld, ensuring you and your
              friends enjoy uninterrupted adventures.
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
      </div>
      <div className="relative">
        <div className="absolute inset-px rounded-lg bg-background lg:rounded-tr-[2rem]" />
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius)+1px)] lg:rounded-tr-[calc(2rem+1px)]">
          <div className="relative aspect-[3/2] w-full overflow-hidden">
            <Deployments />
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/100" />
          </div>
          <div className="p-10 pt-4">
            <h3 className="font-semibold text-primary text-sm/4">Simplicity</h3>
            <p className="mt-2 font-medium text-foreground text-lg tracking-tight">
              One-click global deployment
            </p>
            <p className="mt-2 max-w-lg text-muted-foreground text-sm/6">
              Launch your Minecraft, Valheim, or Palworld server instantly in
              any AWS region around the world. Choose the location closest to
              your players for optimal performance.
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border lg:rounded-tr-[2rem]" />
      </div>
      <div className="relative lg:col-span-2">
        <div className="absolute inset-px rounded-lg bg-background lg:rounded-b-[2rem]" />
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius)+1px)] lg:rounded-b-[calc(2rem+1px)]">
          <div className="relative aspect-[5/2] w-full overflow-hidden p-10">
            <Diagram />
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/100" />
          </div>
          <div className="p-10 pt-4">
            <h3 className="font-semibold text-primary text-sm/4">Security</h3>
            <p className="mt-2 font-medium text-foreground text-lg tracking-tight">
              Enterprise-grade protection
            </p>
            <p className="mt-2 max-w-lg text-muted-foreground text-sm/6">
              Your game servers are protected by SSH key authentication,
              ensuring only you can access your servers through Ultrabeam. No
              password vulnerabilities, no unauthorized access—just secure,
              private gaming for you and your friends.
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border lg:rounded-b-[2rem]" />
      </div>
    </div>
  </div>
);

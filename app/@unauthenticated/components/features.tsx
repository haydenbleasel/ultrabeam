export const Features = () => (
  <div className="grid gap-8">
    <div className="grid gap-6">
      <h2 className="mt-2 max-w-lg text-pretty font-semibold text-4xl text-foreground tracking-tight sm:text-5xl">
        Powerful game servers at your fingertips
      </h2>
      <p className="text-lg text-muted-foreground">
        Powered by AWS Lightsail infrastructure, Ultrabeam...
      </p>
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-2">
      <div className="relative">
        <div className="absolute inset-px rounded-lg bg-background max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]" />
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius)+1px)] max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-tl-[calc(2rem+1px)]">
          <img
            alt=""
            src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-performance.png"
            className="h-80 object-cover object-left"
          />
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
          <img
            alt=""
            src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-releases.png"
            className="h-80 object-cover object-left lg:object-right"
          />
          <div className="p-10 pt-4">
            <h3 className="font-semibold text-primary text-sm/4">Simplicity</h3>
            <p className="mt-2 font-medium text-foreground text-lg tracking-tight">
              One-click deployment
            </p>
            <p className="mt-2 max-w-lg text-muted-foreground text-sm/6">
              Launch your Minecraft, Valheim, or Palworld server in minutes with
              our intuitive interface. No technical expertise required—just
              select your game and start playing.
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border lg:rounded-tr-[2rem]" />
      </div>
      <div className="relative lg:col-span-2">
        <div className="absolute inset-px rounded-lg bg-background lg:rounded-b-[2rem]" />
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius)+1px)] lg:rounded-b-[calc(2rem+1px)]">
          <img
            alt=""
            src="https://tailwindcss.com/plus-assets/img/component-images/bento-01-speed.png"
            className="h-80 object-cover object-left"
          />
          <div className="p-10 pt-4">
            <h3 className="font-semibold text-primary text-sm/4">Control</h3>
            <p className="mt-2 font-medium text-foreground text-lg tracking-tight">
              Complete server management
            </p>
            <p className="mt-2 max-w-lg text-muted-foreground text-sm/6">
              Customize your gaming experience with full access to server
              settings, mods, and player management. Your world, your rules—all
              through our intuitive dashboard.
            </p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border lg:rounded-b-[2rem]" />
      </div>
    </div>
  </div>
);

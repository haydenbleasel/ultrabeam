import Image from 'next/image';
import Background from './background.jpg';

export const Hero = () => (
  <div className="-mt-16 -mx-16 dark relative isolate flex aspect-video items-end overflow-hidden rounded-3xl">
    <Image
      src={Background}
      alt="Background"
      className="absolute inset-0 size-full"
      priority
      quality={100}
    />
    <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/50" />
    <div className="relative z-10 px-16 py-16">
      <h1 className="text-pretty font-semibold text-5xl text-foreground tracking-tight sm:text-6xl">
        Simple, reliable dedicated game servers
      </h1>
      <p className="mt-4 max-w-xl text-pretty text-foreground text-xl opacity-90">
        Create and manage your own dedicated game servers with ease. Start
        playing your favorite games with friends in minutes.
      </p>
    </div>
  </div>
);

'use client';

import { games } from '@/games';
import { Waitlist } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Background from './background.jpg';

export const Hero = () => {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setValue((currentValue) => (currentValue + 1) % games.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="-mx-16 dark relative isolate flex aspect-video items-end overflow-hidden rounded-3xl">
      <Image
        src={Background}
        alt="Background"
        className="absolute inset-0 size-full"
        priority
        quality={100}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/50" />
      <div className="relative z-10 grid grid-cols-2 items-end gap-8 p-16">
        <div className="">
          <h1 className="text-pretty font-semibold text-5xl text-foreground tracking-tight">
            <span className="block">Let's play </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={games[value].id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                {games[value].name}
              </motion.span>
            </AnimatePresence>
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-foreground opacity-90">
            Create and manage your own simple, reliable dedicated game servers
            with ease. Start playing your favorite games with friends in
            minutes.
          </p>
        </div>
        <Waitlist />
      </div>
    </div>
  );
};

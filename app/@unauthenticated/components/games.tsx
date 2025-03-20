import { games } from '@/games';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const Games = () => (
  <div className="grid gap-8">
    <div className="grid gap-6">
      <h2 className="mt-2 max-w-lg text-pretty font-semibold text-4xl text-foreground tracking-tight sm:text-5xl">
        Spin up your favorite games in minutes
      </h2>
      <p className="text-lg text-muted-foreground">
        Ultrabeam supports Valheim, Palworld, and Minecraft.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {games.map((game, index) => (
        <div key={game.name} className="relative">
          <div
            className={cn(
              'absolute inset-px rounded-lg bg-background',
              !index && 'max-lg:rounded-t-[2rem] lg:rounded-l-[2rem]',
              index === games.length - 1 &&
                'max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]'
            )}
          />
          <div
            className={cn(
              'relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius)+1px)]',
              !index &&
                'max-lg:rounded-t-[calc(2rem+1px)] lg:rounded-l-[calc(2rem+1px)]',
              index === games.length - 1 &&
                'max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]'
            )}
          >
            <Image
              alt=""
              src={game.image}
              className="aspect-square w-full object-cover object-left"
              width={320}
              height={320}
            />
            <div className="p-8">
              <p className="font-medium text-foreground text-lg tracking-tight">
                {game.name}
              </p>
              <p className="mt-2 max-w-lg text-muted-foreground text-sm/6">
                {game.description}
              </p>
            </div>
          </div>
          <div
            className={cn(
              'pointer-events-none absolute inset-px rounded-lg shadow-sm ring-1 ring-border',
              !index && 'max-lg:rounded-t-[2rem] lg:rounded-l-[2rem]',
              index === games.length - 1 &&
                'max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]'
            )}
          />
        </div>
      ))}
    </div>
  </div>
);

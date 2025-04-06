import { Badge } from '@/components/ui/badge';
import { games } from '@/games';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export const Games = () => (
  <div className="grid gap-8">
    <div className="grid gap-6">
      <h2 className="mt-2 max-w-lg text-pretty font-semibold text-4xl text-foreground tracking-tight sm:text-5xl">
        Spin up your favorite games in minutes
      </h2>
      <p className="max-w-xl text-lg text-muted-foreground">
        Ultrabeam's managed infrastructure allows you to spin up your favorite
        games without the hassle of setting up your own server.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {games.map((game, index) => (
        <div key={game.name} className="relative">
          <div
            className={cn(
              'absolute inset-px rounded-lg bg-background',
              !index && 'lg:rounded-tl-[2rem]',
              index === 2 && 'lg:rounded-tr-[2rem]',
              index === games.length - 1 && 'lg:rounded-br-[2rem]',
              index === games.length - 3 && 'lg:rounded-bl-[2rem]'
            )}
          />
          <div
            className={cn(
              'relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius)+1px)]',
              !index && 'lg:rounded-tl-[calc(2rem+1px)]',
              index === 2 && 'lg:rounded-tr-[calc(2rem+1px)]',
              index === games.length - 1 && 'lg:rounded-br-[calc(2rem+1px)]',
              index === games.length - 3 && 'lg:rounded-bl-[calc(2rem+1px)]'
            )}
          >
            <div className="relative aspect-square w-full">
              <Image
                alt=""
                src={game.image}
                className="size-full object-cover object-left"
                width={320}
                height={320}
              />
              {!game.enabled && (
                <div className="absolute inset-0 bg-background/50">
                  <div className="flex h-full w-full items-center justify-center">
                    <Badge>Coming soon</Badge>
                  </div>
                </div>
              )}
            </div>
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
              !index && 'lg:rounded-tl-[2rem]',
              index === 2 && 'lg:rounded-tr-[2rem]',
              index === games.length - 1 && 'lg:rounded-br-[2rem]',
              index === games.length - 3 && 'lg:rounded-bl-[2rem]'
            )}
          />
        </div>
      ))}
    </div>
  </div>
);

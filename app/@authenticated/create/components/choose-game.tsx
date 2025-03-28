import { games } from '@/games';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { CheckIcon, MinusIcon } from 'lucide-react';
import Image from 'next/image';

type ChooseGameProps = {
  game: string;
  setGame: (game: string) => void;
};

export const ChooseGame = ({ game, setGame }: ChooseGameProps) => (
  <RadioGroup
    className="grid grid-cols-3 gap-3"
    value={game}
    onValueChange={setGame}
  >
    {games.map((game) => (
      <label key={game.id} htmlFor={game.id}>
        <RadioGroupItem
          id={game.id}
          value={game.id}
          className="peer sr-only after:absolute after:inset-0"
        />
        <Image
          src={game.image}
          alt={game.name}
          width={600}
          height={600}
          className="relative cursor-pointer overflow-hidden rounded-md border border-input shadow-xs outline-none transition-[color,box-shadow] peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 peer-data-disabled:cursor-not-allowed peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent peer-data-disabled:opacity-50"
        />
        <span className="group mt-2 flex items-center gap-1 peer-data-[state=checked]:text-primary peer-data-[state=unchecked]:text-muted-foreground/70">
          <CheckIcon
            size={16}
            className="group-peer-data-[state=unchecked]:hidden"
            aria-hidden="true"
          />
          <MinusIcon
            size={16}
            className="group-peer-data-[state=checked]:hidden"
            aria-hidden="true"
          />
          <span className="font-medium">{game.name}</span>
        </span>
        <span className="text-muted-foreground text-xs">
          {game.description}
        </span>
      </label>
    ))}
  </RadioGroup>
);

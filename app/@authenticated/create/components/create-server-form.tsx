'use client';

import { createServer } from '@/actions/server/create';
import { games } from '@/games';
import type { getRegions, getSizes } from '@/lib/backend';
import { handleError } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem } from '@/ui/accordion';
import { Button } from '@/ui/button';
import { AccordionHeader, AccordionTrigger } from '@radix-ui/react-accordion';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { ChooseGame } from './choose-game';
import { ConfigureServer } from './configure-server';
import { DeployingServer } from './deploying-server';

type CreateServerFormProps = {
  sizes: Awaited<ReturnType<typeof getSizes>>;
  regions: Awaited<ReturnType<typeof getRegions>>;
};

export const CreateServerForm = ({ sizes, regions }: CreateServerFormProps) => {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [game, setGame] = useState<string>('');
  const recommendedSizes = sizes.filter(
    ({ cpu, memory }) => cpu === 2 && memory === 4
  );
  const [size, setSize] = useState<string>(recommendedSizes[0].id);
  const selectedSize = sizes.find(({ id }) => id === size);
  const [region, setRegion] = useState<string>(regions[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [step, setStep] = useState<string>('1');
  const activeGame = games.find(({ id }) => id === game);
  const [serverId, setServerId] = useState<string>('');

  const handleCreateServer = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await createServer(
        name,
        password,
        game as (typeof games)[number]['id'],
        region,
        size
      );

      if ('error' in response) {
        throw new Error(response.error);
      }

      setServerId(response.id);
    } catch (error) {
      handleError(error);
      setIsLoading(false);
    }
  };

  const handleSetGame = (game: string) => {
    setGame(game);
    setStep('2');
  };

  const handleSetStep = (newStep: string) => {
    const newStepInt = Number.parseInt(newStep, 10);
    const currentStepInt = Number.parseInt(step, 10);

    if (newStepInt < currentStepInt) {
      setStep(newStep);
    }
  };

  const items = [
    {
      id: '1',
      title: activeGame ? `Playing ${activeGame.name}` : 'Choose a game',
      description: 'Select the game you want to play!',
      disabled: !!serverId,
      content: <ChooseGame game={game} setGame={handleSetGame} />,
    },
    {
      id: '2',
      title: 'Configure server',
      description: 'Select the size and region for your server.',
      disabled: !activeGame || !!serverId,
      content: (
        <>
          <ConfigureServer
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            size={size}
            setSize={setSize}
            region={region}
            setRegion={setRegion}
            sizes={sizes}
            regions={regions}
            recommendedSizes={recommendedSizes}
          />
          <Button
            className="mt-6 w-fit"
            type="submit"
            disabled={isLoading}
            onClick={handleCreateServer}
          >
            {isLoading ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              `Create server for $${selectedSize?.price}/month`
            )}
          </Button>
        </>
      ),
    },
    {
      id: '3',
      title: 'Deploying server',
      description: 'Your server is being deployed.',
      disabled: !serverId,
      content: <DeployingServer serverId={serverId} />,
    },
  ];

  return (
    <Accordion type="single" collapsible className="w-full" value={step}>
      {items.map((item) => (
        <AccordionItem value={item.id} key={item.id} className="p-6">
          <AccordionHeader className="flex">
            <AccordionTrigger
              className="flex flex-1 items-center justify-between gap-4 rounded-md py-0 text-left font-normal outline-none transition-all hover:no-underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
              onClick={() => handleSetStep(item.id)}
              disabled={item.disabled}
            >
              <div className="grid gap-1">
                <h2 className="font-semibold">{item.title}</h2>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="mt-6">{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

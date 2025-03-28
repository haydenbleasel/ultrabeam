'use client';

import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { ArrowLeftIcon, DollarSignIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useId } from 'react';

type PathProps = {
  value: string;
};

export const Path = ({ value }: PathProps) => {
  const id = useId();
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    const segments = pathname.split('/');
    const newPath = segments.slice(0, -1).join('/');
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={handleBack}
      >
        <ArrowLeftIcon size={16} />
      </Button>
      <div className="flex-1">
        <Label htmlFor={id} className="sr-only">
          Filepath
        </Label>
        <div className="relative">
          <Input
            id={id}
            className="peer bg-secondary ps-9 font-mono"
            defaultValue={value}
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <DollarSignIcon size={16} aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
};

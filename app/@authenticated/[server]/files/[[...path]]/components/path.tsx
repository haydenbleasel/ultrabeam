import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { DollarSignIcon } from 'lucide-react';
import { useId } from 'react';

type PathProps = {
  value: string;
};

export const Path = ({ value }: PathProps) => {
  const id = useId();

  return (
    <div>
      <Label htmlFor={id} className="sr-only">
        Filepath
      </Label>
      <div className="relative">
        <Input id={id} className="peer bg-secondary ps-9" value={value} />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <DollarSignIcon size={16} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

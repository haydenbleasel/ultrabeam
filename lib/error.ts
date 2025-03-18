import { parseError } from '@/lib/observability/error';
import { toast } from 'sonner';

export const handleError = (error: unknown): void => {
  const message = parseError(error);

  toast.error(message);
};

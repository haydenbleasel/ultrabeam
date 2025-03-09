import { parseError } from '@repo/observability/error';
import { toast } from 'sonner';

export const handleError = (error: unknown): void => {
  const message = parseError(error);

  toast.error(message);
};
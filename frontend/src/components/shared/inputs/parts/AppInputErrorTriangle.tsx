import { TriangleAlert as ExclamationTriangleIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type Props = {
  errors: string[] | undefined;
  mode?: 'absolute' | 'inline';
};
export function AppInputErrorTriangle({ errors, mode = 'inline' }: Props) {
  if (!errors) {
    return null;
  }

  return (
    <ExclamationTriangleIcon
      className={cn('text-danger h-5 w-5', mode === 'absolute' ? 'absolute top-2.5 right-5' : '')}
    />
  );
}

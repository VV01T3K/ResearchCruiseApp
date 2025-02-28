import ExclamationTriangleIcon from 'bootstrap-icons/icons/exclamation-triangle.svg?react';

import { cn } from '@/core/lib/utils';

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
      className={cn('w-5 h-5 text-danger', mode === 'absolute' ? 'absolute right-5 top-2.5' : '')}
    />
  );
}

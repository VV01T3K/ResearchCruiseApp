import { useState } from 'react';

import { AppBadge } from '@/core/components/AppBadge';
import { cn } from '@/core/lib/utils';

type Props = {
  title?: string;
  shipUnavailable: boolean;
};
export function CruiseTitleBadge({ title, shipUnavailable }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefix = shipUnavailable ? 'Blokada ' : 'Rejs ';
  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer"
      title={!isExpanded ? 'Kliknij, aby rozwinąć' : 'Kliknij, aby zwinąć'}
    >
      <AppBadge
        variant={shipUnavailable ? 'danger' : 'primary'}
        className={cn('!block max-w-[250px]', isExpanded ? 'break-words whitespace-normal' : 'truncate')}
      >
        {prefix + (title ?? '')}
      </AppBadge>
    </div>
  );
}

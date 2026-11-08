import { useState } from 'react';

import { Badge } from '@/components/shared/Badge';
import { cn } from '@/lib/utils';

type Props = {
  title?: string;
  shipUnavailable: boolean;
};
export function TitleBadge({ title, shipUnavailable }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefix = shipUnavailable ? 'Blokada ' : 'Rejs ';
  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      onClick={() => setIsExpanded(!isExpanded)}
      className="block cursor-pointer rounded-lg focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-hidden md:w-0 md:min-w-full"
      title={!isExpanded ? 'Kliknij, aby rozwinąć' : 'Kliknij, aby zwinąć'}
    >
      <Badge
        variant={shipUnavailable ? 'danger' : 'primary'}
        className={cn('mx-auto !block max-w-[250px]', isExpanded ? 'break-words !whitespace-normal' : 'truncate')}
      >
        {prefix + (title ?? '')}
      </Badge>
    </button>
  );
}

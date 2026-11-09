import type { IconWeight } from '@phosphor-icons/react';
import type { LinkProps } from '@tanstack/react-router';
import React from 'react';

import { Link } from '@/components/shared/Link';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  className?: string;
  Icon: React.ElementType;
  iconWeight?: IconWeight;
  description: string;
  to: LinkProps['to'];
};
export function GridCard({ name, className, Icon, iconWeight, description, to }: Props) {
  return (
    <div key={name} className={cn('phone:col-span-1 phone:row-span-1', className)}>
      <Link to={to} variant="plain" className="group">
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl bg-surface p-4 text-primary shadow-card phone:p-3">
          <div className="size-16 phone:size-11">
            <Icon weight={iconWeight} />
          </div>
          <div>
            <h3 className="font-semibold text-primary md:text-lg xl:text-xl">{name}</h3>
            <p className="text-sm text-neutral-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 phone:hidden">
              {description}
            </p>
          </div>
          <div className="absolute inset-0 transition-colors duration-150 group-hover:bg-neutral-950/[.03]" />
        </div>
      </Link>
    </div>
  );
}

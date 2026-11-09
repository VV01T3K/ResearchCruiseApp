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
      <Link to={to} variant="card">
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl bg-surface p-4 text-primary shadow-card transition-[translate,box-shadow] duration-150 ease-out group-hover:-translate-y-1 group-hover:shadow-card-hover group-focus-visible:-translate-y-1 group-focus-visible:shadow-card-hover group-focus-visible:ring-2 group-focus-visible:ring-primary-500 group-active:translate-y-0 group-active:shadow-card phone:p-3">
          <div className="size-16 phone:size-11">
            <Icon weight={iconWeight} />
          </div>
          <div>
            <h3 className="font-semibold text-primary md:text-lg xl:text-xl">{name}</h3>
            <p className="translate-y-1 text-sm text-neutral-600 opacity-0 transition-[opacity,translate] duration-150 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 phone:hidden">
              {description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}

import type { IconWeight } from '@phosphor-icons/react';
import type { LinkProps } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
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
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <div key={name} className={cn('phone:col-span-1 phone:row-span-1', className)}>
      <Link to={to} variant="plain">
        <motion.div
          className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-xl bg-surface p-4 text-primary shadow-card phone:p-3"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.div
            className="flex flex-col phone:h-full!"
            layout
            style={{
              height: 'calc(100% - 24px)',
              justifyContent: isHovered ? 'flex-start' : 'space-between',
              transition: 'all 1s',
            }}
          >
            <motion.div
              className="phone:size-11!"
              layout
              style={{
                width: isHovered ? 24 : 64,
                height: isHovered ? 24 : 64,
                transition: 'all 0.3s',
              }}
            >
              <Icon weight={iconWeight} />
            </motion.div>
            <motion.h3 className="font-semibold text-primary md:text-lg xl:text-xl">{name}</motion.h3>
          </motion.div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ translateY: '200%' }}
                animate={{ translateY: '0%' }}
                exit={{ translateY: '200%' }}
                transition={{ bounce: 0 }}
              >
                <p className="text-sm text-neutral-600">{description}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={cn('absolute inset-0', isHovered ? 'bg-neutral-950/[.03]' : 'bg-transparent')} />
        </motion.div>
      </Link>
    </div>
  );
}

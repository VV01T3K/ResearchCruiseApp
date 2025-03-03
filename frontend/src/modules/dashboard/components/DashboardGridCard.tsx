import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppLink } from '@/core/components/AppLink';
import { useWindowSize } from '@/core/hooks/WindowSizeHook';
import { cn } from '@/core/lib/utils';

type Props = {
  name: string;
  className?: string;
  Icon: React.ElementType;
  description: string;
  href: string;
};
export function DashboardGridCard({ name, className, Icon, description, href }: Props) {
  const { width } = useWindowSize();
  const [isHovered, setIsHovered] = React.useState(false);
  const isMobile = React.useMemo(() => width < 768, [width]);

  if (isMobile) {
    return (
      <div key={name} className={className}>
        <AppLink href={href} className="hover:no-underline">
          <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="p-4 relative w-full h-full bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] rounded-xl flex flex-col justify-around items-center overflow-hidden"
          >
            <Icon className="h-1/2" />
            <h3 className="text-md md:text-lg xl:text-xl font-semibold text-primary">{name}</h3>
            <div className={cn('absolute inset-0', isHovered ? 'bg-black/[.03]' : 'bg-transparent')} />
          </motion.div>
        </AppLink>
      </div>
    );
  }

  return (
    <div key={name} className={className}>
      <AppLink href={href} className="hover:no-underline">
        <motion.div
          className="p-4 relative w-full h-full bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] rounded-xl flex flex-col justify-between overflow-hidden"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <motion.div
            className="flex flex-col"
            layout
            style={{
              height: 'calc(100% - 24px)',
              justifyContent: isHovered ? 'flex-start' : 'space-between',
              transition: 'all 1s',
            }}
          >
            <motion.div
              layout
              style={{
                width: isHovered ? 24 : 64,
                height: isHovered ? 24 : 64,
                transition: 'all 0.3s',
              }}
            >
              <Icon />
            </motion.div>
            <motion.h3 className="text-md md:text-lg xl:text-xl font-semibold text-primary">{name}</motion.h3>
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

          <div className={cn('absolute inset-0', isHovered ? 'bg-black/[.03]' : 'bg-transparent')} />
        </motion.div>
      </AppLink>
    </div>
  );
}

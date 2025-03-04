import { motion } from 'motion/react';

import { AppPreviousPageButton } from '@/core/components/AppPreviousPageButton';
import { cn } from '@/core/lib/utils';

type Props = {
  title: string;
  children: React.ReactNode;

  description?: string;
  variant?: keyof typeof variants;
  disableBackButton?: boolean;
};

export function AppLayout({ title, children, description, variant = 'default', disableBackButton = false }: Props) {
  return (
    <motion.div
      className="md:p-8 w-full min-h-[calc(100vh-var(--header-height))] relative will-change-transform"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn('mx-auto pb-4 md:p-8 bg-gray-50 rounded-xl', variants[variant])}>
        <header className="mb-8">
          {!disableBackButton && (
            <div className="p-4 md:p-0">
              <AppPreviousPageButton />
            </div>
          )}
          <h1 className="text-3xl font-bold text-center pt-8 md:pt-0 mb-2">{title}</h1>
          {description ? <p className="text-gray-600 font-semibold text-center">{description}</p> : null}
        </header>
        {children}
      </div>
    </motion.div>
  );
}

const variants = {
  default: 'max-w-screen-2xl',
  narrow: 'max-w-2xl mt-[10vh] md:mt-[25zvh]',
  defaultWithCentering: 'max-w-screen-2xl mt-[10vh] md:mt-[20vh]',
};

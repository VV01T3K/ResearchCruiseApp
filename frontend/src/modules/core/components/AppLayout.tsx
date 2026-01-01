import { motion } from 'motion/react';

import { AppPreviousPageButton } from '@/core/components/AppPreviousPageButton';
import { cn } from '@/core/lib/utils';

type Props = {
  title: string;
  children: React.ReactNode;

  description?: string;
  variant?: keyof typeof variants;
  disableBackButton?: boolean;
  'data-testid'?: string;
};

export function AppLayout({
  title,
  children,
  description,
  variant = 'default',
  disableBackButton = false,
  'data-testid': testId,
}: Props) {
  return (
    <motion.div
      className="relative min-h-[calc(100vh-var(--header-height))] w-full px-6 will-change-transform md:px-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={cn('mx-auto rounded-xl bg-gray-50 px-8 py-4 md:px-16 md:py-8', variants[variant])}>
        <header className="mb-8">
          {!disableBackButton && (
            <div className="p-4 md:p-0">
              <AppPreviousPageButton />
            </div>
          )}
          <h1 className="mb-2 pt-8 text-center text-3xl font-bold md:pt-0" data-testid={testId}>
            {title}
          </h1>
          {description ? <p className="text-center font-semibold text-gray-600">{description}</p> : null}
        </header>
        {children}
      </div>
    </motion.div>
  );
}

const variants = {
  default: 'max-w-[1920px]',
  narrow: 'max-w-2xl mt-[10vh] md:mt-[25zvh]',
  defaultWithCentering: 'max-w-[1920px] mt-[10vh] md:mt-[20vh]',
};

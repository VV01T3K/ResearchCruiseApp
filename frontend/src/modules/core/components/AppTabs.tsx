import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { AppButton } from '@/core/components/AppButton';
import { cn } from '@/core/lib/utils';

type Props = {
  children: React.ReactNode[];
  tabNames: string[];
};
export function AppTabs({ children, tabNames }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const [previousTab, setPreviousTab] = useState(-1);

  if (tabNames.length !== children.length) {
    throw new Error('The number of tab names must match the number of tab children');
  }

  const animateDirection = activeTab > previousTab ? 'right' : 'left';

  return (
    <div>
      <div className="mr-2 ml-2 flex gap-8 text-center">
        {tabNames.map((tabName, index) => (
          <AppButton
            className={cn(
              index === activeTab ? 'bg-primary font-bold text-white' : 'hover:bg-primary-200 bg-gray-200',
              'w-full rounded-full transition'
            )}
            variant="plain"
            onClick={() => {
              setPreviousTab(activeTab);
              setActiveTab(index);
            }}
            key={tabName}
          >
            {tabName}
          </AppButton>
        ))}
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scaleX: 0, transformOrigin: animateDirection === 'left' ? '0% 50%' : '100% 50%' }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0, transformOrigin: animateDirection === 'left' ? '0% 50%' : '100% 50%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {children[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

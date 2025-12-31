import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  expandedByDefault?: true | undefined;
  'data-testid'?: string;
  'data-testid-toggle'?: string;
  'data-testid-content'?: string;
};

export function AppAccordion({
  title,
  children,
  expandedByDefault = undefined,
  'data-testid': testId,
  'data-testid-toggle': toggleTestId,
  'data-testid-content': contentTestId,
}: Props) {
  const [expanded, setExpanded] = React.useState<boolean>(!!expandedByDefault);

  return (
    <div data-testid={testId}>
      <h2 className="w-full">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-black/2 px-4 py-4"
          onClick={() => setExpanded(!expanded)}
          data-expanded={expanded}
          data-testid={toggleTestId}
        >
          <span className="text-lg font-semibold">{title}</span>
          <span>{expanded ? <ChevronUpIcon className="h-6 w-6" /> : <ChevronDownIcon className="h-6 w-6" />}</span>
        </button>
      </h2>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ ease: 'easeOut' }}
            className="px-4"
            data-testid={contentTestId}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

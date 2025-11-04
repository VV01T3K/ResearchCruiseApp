import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  expandedByDefault?: true | undefined;
};

export function AppAccordion({ title, children, expandedByDefault = undefined }: Props) {
  const [expanded, setExpanded] = React.useState<boolean>(!!expandedByDefault);

  return (
    <>
      <h2 className="w-full">
        <button
          type="button"
          className="w-full flex justify-between items-center cursor-pointer px-4 py-4 bg-black/2 rounded-xl"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="font-semibold text-lg">{title}</span>
          <span>{expanded ? <ChevronUpIcon className="w-6 h-6" /> : <ChevronDownIcon className="w-6 h-6" />}</span>
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
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

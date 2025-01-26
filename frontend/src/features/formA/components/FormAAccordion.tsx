import React from 'react';
import ChevronDownIcon from 'bootstrap-icons/icons/chevron-down.svg?react';
import ChevronUpIcon from 'bootstrap-icons/icons/chevron-up.svg?react';
import { AnimatePresence, motion } from 'motion/react';

type Props = {
  title: string;
  children: React.ReactNode;
  expandedByDefault?: true | undefined;
};

export function FormAAccordion({ title, children, expandedByDefault = undefined }: Props) {
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
      <AnimatePresence>
        {expanded ? (
          <motion.div
            initial={{ opacity: 0, y: '-100%', z: -50 }}
            animate={{ opacity: 1, y: 0, z: 0 }}
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeOut', y: '-100%', z: -50 }}
            className="px-4 py-4"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

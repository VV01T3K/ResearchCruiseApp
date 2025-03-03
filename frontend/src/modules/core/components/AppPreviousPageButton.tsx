import { motion } from 'motion/react';
import React from 'react';

import { AppLink } from '@/core/components/AppLink';

export function AppPreviousPageButton() {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} className="w-8" layout>
      <AppLink href=".." title="Cofnij się">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="bi bi-arrow-left-circle rounded-full"
          viewBox="0 0 16 16"
          initial={{ backgroundColor: '#fff' }}
          animate={{ backgroundColor: isHovered ? '#0041d2' : '#fff' }}
          transition={{ duration: 0.2 }}
        >
          <path
            fillRule="evenodd"
            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0"
            fill="#0041d2"
          />
          <motion.path
            fillRule="evenodd"
            d="M16 8m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"
            initial={{ fill: '#0041d2' }}
            animate={{ fill: isHovered ? '#fff' : '#0041d2' }}
            transition={{ duration: 0.2 }}
          />
        </motion.svg>
      </AppLink>
    </motion.div>
  );
}

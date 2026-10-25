import { ArrowCircleLeftIcon } from '@phosphor-icons/react';
import { useRouter } from '@tanstack/react-router';
import { motion } from 'motion/react';
import React from 'react';

export function AppPreviousPageButton() {
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} className="w-8" layout>
      <a className="hover:cursor-pointer" title="Cofnij się" onClick={() => router.history.back()}>
        <span className="relative block aspect-square rounded-full bg-white text-primary">
          <motion.span
            className="absolute inset-0"
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowCircleLeftIcon />
          </motion.span>
          <motion.span
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowCircleLeftIcon weight="fill" />
          </motion.span>
        </span>
      </a>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { ComponentPropsWithoutRef, PropsWithChildren } from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.9,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.2,
  },
};
const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 1,
};

export const PageWrapper = ({ children, ...props }: PropsWithChildren<ComponentPropsWithoutRef<'div'>>) => (
  // todo: fix this stupid type
  // @ts-ignore
  <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} {...props}>
    {children}
  </motion.div>
);

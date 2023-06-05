import { c } from '@/app/utils';
import { PropsWithChildren } from 'react';

export const Subtitle = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => {
  return <h2 className={c('text-xl text-gray-700', className)}>{children}</h2>;
};

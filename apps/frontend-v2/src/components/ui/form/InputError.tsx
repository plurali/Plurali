import { c } from '@/app/utils';
import { PropsWithChildren } from 'react';

export const InputError = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => (
  <p className={c('text-sm text-red-700 mt-1 ml-1', className)}>{children}</p>
);

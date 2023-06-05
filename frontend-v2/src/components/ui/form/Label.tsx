import { c } from '@/app/utils';
import { PropsWithChildren } from 'react';

export const Label = ({ children, className = '' }: PropsWithChildren<{ className?: string }>) => (
  <label className={c('mb-1 ml-1 inline-block text-gray-700', className)}>{children}</label>
);

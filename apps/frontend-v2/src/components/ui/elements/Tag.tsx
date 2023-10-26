import { c } from '@/app/utils';
import { PropsWithChildren } from 'react';

export interface TagProps {
  onClassName?: string;
  offClassName?: string;
  className?: string;
  toggled: boolean;
  disabled?: boolean;
  onToggle?: (state: boolean) => unknown;
}

export const Tag = ({
  onClassName,
  offClassName,
  className,
  toggled,
  disabled = false,
  onToggle,
  children,
}: PropsWithChildren<TagProps>) => {
  const Element = onToggle ? 'button' : 'span';

  return (
    <Element
      onClick={() => onToggle?.(!toggled)}
      className={c(
        'text-sm hover:opacity-75 uppercase p-1 px-4 text-white font-semibold rounded-2xl cursor-pointer transition',
        toggled ? c('bg-green-500', onClassName) : c('bg-red-500', offClassName),
        disabled && 'cursor-disabled opacity-25 hover:opacity-25 bg-gray-500',
        className,
      )}
    >
      {children}
    </Element>
  );
};

import { Sanitizer, setHTML } from '@plurali/sanitizer';
import { hasWindow } from '@/app/utils';
import { useState, useEffect } from 'react';

export interface SanitizedProps {
  unsafeValue: string;
}

export const Sanitized = ({ unsafeValue }: SanitizedProps) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (hasWindow() && ref) {
      const sanitizer = new Sanitizer();
      setHTML.bind(ref)(unsafeValue, { sanitizer });
    }
  }, [ref, unsafeValue]);

  return <div ref={setRef}></div>;
};

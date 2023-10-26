import { c } from '@/app/utils';
import { ModelProps, WithClassName } from '@/components/types/utils';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { ChangeEventHandler, DragEventHandler, useEffect, useMemo, useState } from 'react';

export interface UploaderProps extends WithClassName, ModelProps<Blob | null> {
  accept?: string[];
}

export const Uploader = ({
  value,
  setValue,
  accept = ['image/png', 'image/jpeg', 'image/avif', 'image/gif', 'image/webp'],
  className,
}: UploaderProps) => {
  const dragEvents: string[] = ['dragenter', 'dragleave', 'dragover', 'drop'];

  const [dragged, setDragged] = useState(false);
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  const thumbnail = useMemo(() => (value ? URL.createObjectURL(value) : null), [value]);

  const handleDrop: DragEventHandler<HTMLDivElement> = e => {
    e.preventDefault();

    setDragged(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length >= 1) {
      const file = e.dataTransfer.files.item(0);
      setValue(file);
    }
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = e => {
    e.preventDefault();

    if (input?.files) {
      setValue(input.files.length >= 1 ? input.files.item(0) : null);
    }
  };

  useEffect(() => {
    const prevent = (e: Event) => e.preventDefault();

    dragEvents.forEach(eventName => document.body.addEventListener(eventName, prevent));

    return () => {
      dragEvents.forEach(e => document.body.removeEventListener(e, prevent));
    };
  }, []);

  return (
    <div
      onDragOver={() => setDragged(true)}
      onDragLeave={() => setDragged(false)}
      onDrop={handleDrop}
      onClick={() => input?.click()}
      className={c(
        'w-full min-h-[10rem] h-full inset-0 flex justify-center items-center rounded-2xl cursor-pointer',
        !value && 'bg-gray-100 bg-opacity-50',
        className
      )}
    >
      <input ref={setInput} type="file" className="hidden" accept={accept.join(',')} onChange={handleChange} />
      {!dragged && !thumbnail ? (
        <div className="inline-flex justify-center items-center gap-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 shadow-xl">
            <DocumentArrowUpIcon className="h-8 w-8 text-violet-600" aria-hidden="true" />
          </div>
          <p className="text-2xl text-violet-600 font-light hidden uppercase md:inline-block t">
            {value && !thumbnail ? 'Preview not available' : 'or drag & drop'}
          </p>
        </div>
      ) : dragged ? (
        <div className="text-2xl text-violet-600 font-medium hidden md:inline-block">you're almost there!</div>
      ) : (
        thumbnail && (
          <img
            src="thumbnail"
            className="rounded-2xl sm:max-h-64 md:max-h-[32rem] border-2 border-violet-500 border-opacity-50"
          />
        )
      )}
    </div>
  );
};

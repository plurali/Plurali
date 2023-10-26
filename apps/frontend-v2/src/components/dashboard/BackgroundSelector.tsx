import { FormEventHandler, useMemo, useState } from 'react';
import { Modal } from '@/components/ui/elements/Modal';
import { Button } from '@/components/ui/elements/Button';
import { PhotoIcon, SwatchIcon } from '@heroicons/react/24/outline';
import { BackgroundType } from '@prisma/client';
import { BackgroundDataInterface } from '@app/v2/dto/partials/BackgroundDataInterface';
import { c } from '@/app/utils';
import { Uploader } from '../ui/form/Uploader';
import { Palette } from '../ui/form/Palette';

export interface BackgroundSelectorProps {
  initialData: BackgroundDataInterface;
  name?: string;
  onUpdateColor: (data: string) => Promise<unknown>;
  onUpdateImage: (data: Blob) => Promise<unknown>;
}

export const BackgroundSelector = ({ initialData, name, onUpdateColor, onUpdateImage }: BackgroundSelectorProps) => {
  const iconClass = 'w-8 h-8 text-violet-600';

  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [type, setType] = useState<BackgroundType>(initialData.type);

  const initialColor = useMemo(() => initialData.color, [initialData]);

  const [color, setColor] = useState<string | null>(initialColor);
  const [image, setImage] = useState<Blob | null>(null);

  const hasValidData = useMemo(() => {
    if (type === BackgroundType.Image) return !!image;
    else return !!color && type !== initialColor;
  }, [type]);

  const toggleOpen = () => setOpen(o => !o);

  const onSubmit: FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault();

    if (!hasValidData) {
      return;
    }

    setLoading(true);

    try {
      if (type === BackgroundType.Image && image) {
        await onUpdateImage(image);
      } else if (type === BackgroundType.Color && color) {
        await onUpdateColor(color);
      }

      setOpen(false);
    } catch {}

    setLoading(false);
  };

  return (
    <>
      <Button
        onClick={toggleOpen}
        className="border-[2.5px] bg-white bg-opacity-25 border-violet-300 text-black inline-flex justify-center items-center gap-1"
      >
        <PhotoIcon className="w-8 h-8" />
        <span>Background</span>
      </Button>
      <Modal
        value={open}
        setValue={setOpen}
        title={`Background ${type}${name ? ` for ${name}` : ''}`}
        color="bg-violet-100"
        loading={loading}
        goBack={hasValidData ? 'Cancel' : null}
        renderIcon={() =>
          type === BackgroundType.Image ? <PhotoIcon className={iconClass} /> : <SwatchIcon className={iconClass} />
        }
        renderHeader={() => (
          <div className="rounded-2xl bg-gray-100 p-1">
            {Object.keys(BackgroundType).map(t => (
              <Button
                key={t}
                onClick={() => setType(t as BackgroundType)}
                className={c(
                  'text-lg transition duration-500 ease-in-out',
                  t === type && `bg-white shadow-md font-medium`,
                )}
              >
                {type}
              </Button>
            ))}
          </div>
        )}
      >
        <form onSubmit={onSubmit} encType={type !== BackgroundType.Image ? 'multipart/form-data' : ''}>
          {type === BackgroundType.Image ? (
            <Uploader value={image} setValue={setImage} />
          ) : (
            <Palette value={color} setValue={setColor} />
          )}

          {hasValidData && (
            <Button
              disabled={loading}
              loading={loading}
              spinnerClassName={'!text-violet-700'}
              type="submit"
              className="mt-5 w-full border border-violet-700 hover:bg-violet-700 hover:bg-opacity-10 text-violet-700 mb-1 inline-flex justify-between items-center"
            >
              <p className="font-semibold">{loading ? 'Saving...' : 'Save'}</p>
            </Button>
          )}
        </form>
      </Modal>
    </>
  );
};

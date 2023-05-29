import Pickr from '@simonwep/pickr';
import { EyeDropperIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { hasWindow } from '@/app/utils';
import { ModelProps, WithClassName } from '@/components/types/utils';

import '@/styles/palette.css';

const createPaletteConfig = (el: HTMLElement, defaultColor?: string | null): Pickr.Options => {
    if (!defaultColor) defaultColor = 'rgb(109, 40, 217)';

    return {
        el,
        theme: 'classic',
        default: defaultColor,
        swatches: [
            defaultColor,
            'rgb(244, 67, 54)',
            'rgb(233, 30, 99)',
            'rgb(156, 39, 176)',
            'rgb(103, 58, 183)',
            'rgb(63, 81, 181)',
            'rgb(33, 150, 243)',
            'rgb(3, 169, 244)',
            'rgb(0, 188, 212)',
            'rgb(0, 150, 136)',
            'rgb(76, 175, 80)',
            'rgb(139, 195, 74)',
            'rgb(205, 220, 57)',
            'rgb(255, 235, 59)',
            'rgb(255, 193, 7)',
        ],
        components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
                input: true,
                save: true,
            },
        },
        closeOnScroll: true,
    }
};

export type PaletteProps = WithClassName & ModelProps<string | null>;

export const Palette = ({ value, setValue, className }: PaletteProps) => {
    const [input, setInput] = useState<HTMLInputElement | null>(null);
    const [palette, setPalette] = useState<Pickr | null>(null);

    const createPalette = () => {
        if (hasWindow()) {
            palette?.destroyAndRemove();

            if (input) {
                const palette = new Pickr(createPaletteConfig(input, value));
            
                palette.on('save', () => setValue(palette?.getColor().toHEXA().toString() ?? null))

                setPalette(palette);
            }
        }
    }

    const handleParentClick = () => {
        if (!palette) {
            createPalette()
        }

        if (palette?.isOpen()) {
            palette.hide()
        } else {
            palette?.show();
        }
    }

    useEffect(() => {
        createPalette();

        return () => {
            palette?.destroyAndRemove();
        }
    }, [input]);

    return (
        <div className="relative w-full">
            <input type="text" ref={setInput} />
            <div
                className="absolute w-full h-full inset-0 flex justify-center items-center rounded-2xl cursor-pointer bg-transparent"
                onClick={handleParentClick}
            >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 shadow-xl">
                    <EyeDropperIcon className="h-8 w-8 text-violet-600" aria-hidden="true" />
                </div>
            </div>
        </div>
    )
}
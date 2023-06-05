export const hasWindow = () => typeof window !== 'undefined';

export const isDev = ['dev', 'development'].includes(String(process.env.NODE_ENV).toLowerCase());

export const c = (...strings: (string | false | undefined | false | null)[]) => strings.filter(s => !!s).join(' ');

export const transitionClass = 'transition duration-300 ease-in-out';

export const external = {
  target: '_blank',
  rel: 'noopenner noreferrer',
};

export const icon = {
  small: 'w-8 h-8 text-white',
  medium: 'w-16 h-16 text-white',
  smallToMedium: 'w-8 md:w-16 h-8 md:h-16 text-white',
};

export function string(val: any): val is string {
  return typeof val === 'string';
}

export const getRouteParam = (val: unknown | string | string[]): string => String(Array.isArray(val) ? val[0] : val);

export const isUrl = (url: string): boolean => {
  try {
    return !!new URL(url);
  } catch {
    return false;
  }
};

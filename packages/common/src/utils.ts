import { Visibility } from '@prisma/client';

export const getRouteParam = (val: unknown | string | string[]): string => String(Array.isArray(val) ? val[0] : val);

export const hexRegex = /^#(([0-9A-Fa-f]{2}){3,4}|[0-9A-Fa-f]{3,4})$/;

export const isHex = (value: string): boolean => {
  return hexRegex.test(value);
};

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const isEmail = (value: string): boolean => {
  return emailRegex.test(value);
};

export const isUrl = (url: string): boolean => {
  try {
    return !!new URL(url);
  } catch {
    return false;
  }
};

type EntityOrVisibility = Visibility | { visibility: Visibility } | { data: { visibility: Visibility } } | boolean;

const boolToVisibility = (value: boolean): Visibility => {
  return value ? Visibility.Public : Visibility.Private;
};

export const parseVisibility = (entityOrVisibility: EntityOrVisibility) => {
  if (typeof entityOrVisibility === 'boolean') {
    return boolToVisibility(entityOrVisibility);
  }

  if (typeof entityOrVisibility === 'object') {
    if ('data' in entityOrVisibility) {
      return entityOrVisibility.data.visibility;
    }

    return entityOrVisibility.visibility;
  }

  return entityOrVisibility;
};

export const toggleVisibilityState = (entityOrVisibility: EntityOrVisibility) => {
  return parseVisibility(entityOrVisibility) === Visibility.Private ? Visibility.Public : Visibility.Private;
};

export const isVisibilityPublic = (entityOrVisibility: EntityOrVisibility) => {
  return parseVisibility(entityOrVisibility) === Visibility.Public;
};

export const isVisibilityPrivate = (entityOrVisibility: EntityOrVisibility) => {
  return parseVisibility(entityOrVisibility) === Visibility.Private;
};

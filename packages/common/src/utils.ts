import { Visibility } from "@prisma/client";

export const getRouteParam = (val: unknown | string | string[]): string => String(Array.isArray(val) ? val[0] : val);

export const hexRegex = /^#(([0-9A-Fa-f]{2}){3,4}|[0-9A-Fa-f]{3,4})$/;

export const isHex = (value: string): boolean => {
  return hexRegex.test(value);
}

export const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const isEmail = (value: string): boolean => {
  return emailRegex.test(value);
}

export const isUrl = (url: string): boolean => {
  try {
    return !!new URL(url);
  } catch {
    return false;
  }
};

export const toggleVisibilityState = (visibility: Visibility) => {
  return visibility === Visibility.Private ? Visibility.Public : Visibility.Private;
}

type EntityOrVisibility = Visibility | { visibility: Visibility } | { data: { visibility: Visibility } };

const parseVisibility = (entityOrVisibility: EntityOrVisibility) => {
  const visibility = typeof entityOrVisibility === "object"
    ? "data" in entityOrVisibility
      ? entityOrVisibility.data.visibility
      : entityOrVisibility.visibility
    : entityOrVisibility;

  return visibility;
}

export const isVisibilityPublic = (entityOrVisibility: EntityOrVisibility) => {
  return parseVisibility(entityOrVisibility) === Visibility.Public;
}

export const isVisibilityPrivate = (entityOrVisibility: EntityOrVisibility) => {
  return parseVisibility(entityOrVisibility) === Visibility.Private;
}
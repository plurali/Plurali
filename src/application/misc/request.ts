export const notEmpty = (value: any): boolean => {
  if (value == null || value === undefined) return false;
  if (typeof value === 'string' && value.trim().length < 1) return false;
  return true;
};

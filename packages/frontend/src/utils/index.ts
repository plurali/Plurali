export const getRouteParam = (val: unknown | string | string[]): string =>
  String(Array.isArray(val) ? val[0] : val)

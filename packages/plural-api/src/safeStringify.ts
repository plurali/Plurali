export const safeStringify = (val: unknown) => {
  const seen = new WeakSet();
  return JSON.stringify(val, function (_, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[circular]';
      }
      seen.add(value);
    }
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }
    if (typeof value === 'undefined') {
      return '__undefined__';
    }
    return value;
  });
};
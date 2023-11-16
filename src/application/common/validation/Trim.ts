import { Transform } from 'class-transformer';

export function Trim(): PropertyDecorator {
  return Transform(({ value }) => (value && typeof value === 'string' ? value.trim() : value));
}

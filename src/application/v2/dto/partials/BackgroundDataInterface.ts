import { BackgroundType } from '@domain/common';

export interface BackgroundDataInterface {
  type: BackgroundType;
  color: string | null;
  image: string | null;
}

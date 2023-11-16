import { Visibility } from '@prisma/client';
import { BackgroundDataInterface } from '../partials/BackgroundDataInterface';

export interface SystemDataDtoInterface {
  slug: string | null;
  description: string | null;
  background: BackgroundDataInterface;
  assetsUpdatedAt: Date;
  visibility: Visibility;
}

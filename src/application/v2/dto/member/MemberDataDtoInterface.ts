import { Visibility } from '@prisma/client';
import { BackgroundDataInterface } from '../partials/BackgroundDataInterface';

export interface MemberDataDtoInterface {
  slug: string | null;
  description: string | null;
  assetsUpdatedAt: Date;
  visibility: Visibility;
  background: BackgroundDataInterface;
}

import { IdentifiableEntityDtoInterface } from '@app/v2/types/response';
import { OwnerType, Visibility } from '@prisma/client';

export interface PageDtoInterface extends IdentifiableEntityDtoInterface {
  ownerType: OwnerType;
  ownerId: string;
  name: string;
  slug: string;
  content: string;
  visibility: Visibility;
}

import { Visibility } from '@prisma/client';

export interface UpdateMemberRequestInterface {
  visibility: Visibility | null;
  description: string | null;
  backgroundColor: string | null;
}

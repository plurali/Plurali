import { Visibility } from '@prisma/client';

export interface UpdateSystemRequestInterface {
  visibility: Visibility | null;
  description: string | null;
  backgroundColor: string | null;
}

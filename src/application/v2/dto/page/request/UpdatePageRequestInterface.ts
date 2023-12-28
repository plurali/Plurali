import { Visibility } from '@prisma/client';

export interface UpdatePageRequestInterface {
  name: string | null;
  content: string | null;
  visibility: Visibility | null;
}

import { Visibility } from '@prisma/client';

export interface CreatePageRequestInterface {
  name: string;
  content: string;
  visibility: Visibility;
}

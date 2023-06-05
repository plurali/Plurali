import { UserRole } from '@prisma/client';

export interface UserDtoInterface {
  id: string;
  username: string;
  accessToken: string | null;
  systemIdOverride: string | null;
  role: UserRole;
}

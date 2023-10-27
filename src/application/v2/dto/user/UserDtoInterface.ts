import { UserRole } from '@prisma/client';

export interface UserDtoInterface {
  id: string;
  username: string;
  email: string;
  verified: boolean;
  accessToken: string | null;
  systemIdOverride: string | null;
  role: UserRole;
}

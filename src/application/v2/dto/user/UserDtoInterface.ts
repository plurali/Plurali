import { UserRole } from "@prisma/client";

export interface UserDtoInterface {
  id: string;
  username: string;
  email: string;
  verified: boolean;
  hasSimplyToken: boolean;
  systemIdOverride: string | null;
  role: UserRole;
}

import { NotificationType } from '@prisma/client';

export interface NotificationDtoInterface {
  id: string;
  content: string;
  color: string;
  type: NotificationType;
}

import { Injectable } from "@nestjs/common";
import { NotificationRepository } from "./NotificationRepository";
import { Notification, NotificationType, User } from "@prisma/client";

@Injectable()
export class NotificationService {
    constructor(
        private readonly notifications: NotificationRepository
    ) {
    }

    public async clearNotificationsForUser(user: User): Promise<void> {
        await this.notifications.deleteMany({
            where: {
                type: NotificationType.User,
                userId: user.id,
                OR: [{ expiresAt: { lte: new Date() } }, { permanent: false }]
            }
        })
    }

    public async getNotificationsAndClear(user: User, includeGlobal = true): Promise<Notification[]> {
        const notifications = await this.notifications.findMany({
            where: {
                OR: [...(includeGlobal ? [{ type: NotificationType.Global }] : []), { type: NotificationType.User, userId: user.id }],
            }
        })

        await this.clearNotificationsForUser(user);

        return notifications;
    }
}
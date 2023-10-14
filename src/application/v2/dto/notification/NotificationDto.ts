import { Notification, NotificationType } from "@prisma/client";
import { NotificationDtoInterface } from "./NotificationDtoInterface";
import { ApiProperty } from "@nestjs/swagger";

export class NotificationDto implements NotificationDtoInterface {
    @ApiProperty()
    public id: string;

    @ApiProperty()
    public content: string;

    @ApiProperty({ description: "Danger/Warning/Success/Info/#hex" })
    public color: string;

    @ApiProperty()
    public type: NotificationType;

    constructor(
        id: string,
        content: string,
        color: string,
        type: NotificationType,
    ) {
        this.id = id;
        this.content = content;
        this.color = color;
        this.type = type;
    }

    public static from(notification: Notification): NotificationDto {
        return new NotificationDto(notification.id, notification.content, notification.color, notification.type);
    }
}
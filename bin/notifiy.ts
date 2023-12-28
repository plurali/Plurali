import { NotificationType, PrismaClient, User } from "@prisma/client";
import { prompt } from "inquirer";
import { ObjectId } from "bson";

export enum ColorType {
  Danger = "Danger",
  Warning = "Warning",
  Success = "Success",
  Info = "Info",
}

export interface NotificationInquiry {
  content: string;
  type: NotificationType;
  userId?: string;
  expiresAt: Date | null;
  permanent: boolean;
  color: ColorType | string;
}

const prisma = new PrismaClient();

const isHex = (hex: string) => /^#(([0-9A-Fa-f]{2}){3,4}|[0-9A-Fa-f]{3,4})$/.test(hex);

export const run = async () => {
  let { content, type, userId = null, expiresAt = null, permanent = false, color = ColorType.Info } = await prompt<NotificationInquiry>([
    {
      type: "input",
      name: "content",
      message: "Content",
    },
    {
      type: "list",
      name: "type",
      choices: Object.keys(NotificationType) as NotificationType[],
      message: "Type of notification?"
    },
    {
      type: "input",
      name: "userId",
      message: "Enter User ID",
      when: (a) => a.type === NotificationType.User,
      validate: (val) => ObjectId.isValid(val)
    },
    {
      type: "input",
      name: "expiresAt",
      message: "When should the notification expire (0/nothing to never expire)",
      validate: (val) => {
        if (!val) {
          return true; // null/undefined => no expiry date
        }

        if (typeof val !== "string") {
          return false;
        }

        const timestamp = Number(val);

        if (!isNaN(timestamp)) {
          return false;
        }

        if (timestamp <= 0) {
          return true; // 0 or less is the same as null
        }

        // check if the expiry is not in the past (has to be higher than now+1min)
        if (timestamp < (new Date().getTime() + 60 * 1000)) {
          return false
        }

        return !isNaN(Number(val));
      },
      transformer: (val) => {
        if (!val) {
          return null;
        }

        const timestamp = Number(val);

        if (timestamp <= 0) {
          return null;
        }

        return new Date(timestamp);
      }
    },
    {
      type: "confirm",
      name: "permanent",
      message: "Should the notification be permanent?"
    },
    {
      type: "input",
      name: "color",
      message: "Color of the notification?",
      default: ColorType.Info,
      validate: (val) => {
        if (typeof val !== "string") {
          return false;
        }

        if (val.startsWith("#")) {
          return isHex(val);
        }

        return Object.keys(ColorType).includes(val);
      }
    }
  ]);

  let user: User | null = null;

  if (userId && type === NotificationType.User) {
    user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new Error("Invalid User id");
    }
  }

  const notification = await prisma.notification.create({
    data: {
      type,
      permanent,
      content,
      color,
      ...(expiresAt && expiresAt instanceof Date ? { expiresAt } : {}),
      ...(user ? {
        user: {
          connect: user,
        },
      } : {}),
    }
  })

  return console.log({
    notification
  });
}

run();

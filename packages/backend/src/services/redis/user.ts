import { User } from "@prisma/client"
import { $redis } from "."

export const clearUserCache = async (user: string | User) => {
    const id = typeof user === "string" ? user : user.id;
    const keys = await $redis.keys(`*PluraliUser${id}*`);

    const transaction = $redis.multi();

    for (const key of keys) {
        transaction.del(key)
    }

    await transaction.exec();
}
import { User as BaseUser } from "@prisma/client"

export class UserDto {
    constructor(
        public id: string,
        public username: string,
        public pluralKey: string | null,
    ) {}

    public static from(user: BaseUser): UserDto {
        return new this(user.id, user.username, user.pluralKey ?? null);
    }
}
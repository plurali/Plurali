import {UserData, UserMemberData} from "@prisma/client";
export class UserDataDto {
    constructor(
        public slug: string,
        public description: string,
        public visible: boolean,
    ) {
    }

    public static from(userData: UserData): UserDataDto {
        return new this(userData.slug, userData.description, userData.visible)
    }
}
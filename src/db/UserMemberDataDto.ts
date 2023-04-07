import {UserMemberData} from "@prisma/client";

export class UserMemberDataDto {
    constructor(
        public slug: string,
        public description: string,
        public visible: boolean,
    ) {
    }

    public static from(userMemberData: UserMemberData): UserMemberDataDto {
        return new this(userMemberData.slug, userMemberData.description, userMemberData.visible)
    }
}
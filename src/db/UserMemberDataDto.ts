import {UserMember} from "@prisma/client";

export class UserMemberDataDto {
    constructor(
        public slug: string,
        public description: string,
        public visible: boolean,
    ) {
    }

    public static from(userMember: UserMember): UserMemberDataDto {
        return new this(userMember.slug, userMember.description, userMember.visible)
    }
}
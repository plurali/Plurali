import {UserFieldData} from "@prisma/client";

export class UserFieldDataDto {
    constructor(
        public description: string,
        public visible: boolean,
    ) {
    }

    public static from(userFieldData: UserFieldData): UserFieldDataDto {
        return new this(userFieldData.description, userFieldData.visible)
    }
}
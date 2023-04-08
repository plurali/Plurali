import {UserField} from "@prisma/client";

export class UserFieldDataDto {
    constructor(
        public description: string,
        public visible: boolean,
    ) {
    }

    public static from(userField: UserField): UserFieldDataDto {
        return new this(userField.description, userField.visible)
    }
}
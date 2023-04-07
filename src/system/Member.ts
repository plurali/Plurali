import { MemberFieldWithValue } from "./MemberField";
import { Visibility } from "./Visibility";
import {UserMemberData} from "@prisma/client";

export class Member {
    constructor(
        public id: string,
        public name: string,
        public pronouns: string|null,
        public visibility: Visibility,
        public lastModified: Date,
        public color: string|null,
        public description: string|null,
        public fields: MemberFieldWithValue[],
        public avatar: string|null = null,
        public data: UserMemberData,
    ) {}
}
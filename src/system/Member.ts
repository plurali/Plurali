import { MemberFieldWithValue } from "./MemberField";
import { PluralVisibility } from "./PluralVisibility";
import {UserMemberDataDto} from "../db/UserMemberDataDto";

export class Member {
    constructor(
        public id: string,
        public systemId: string,
        public name: string,
        public pronouns: string|null,
        public pluralVisibility: PluralVisibility,
        public lastModified: Date,
        public color: string|null,
        public description: string|null,
        public fields: MemberFieldWithValue[],
        public avatar: string|null = null,
        public data: UserMemberDataDto,
    ) {}
}
import { PluralMemberEntry } from "@domain/plural/types/rest/members";
import { Member } from "@prisma/client";

export class MemberMeiliDoc {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public pluralDescription: string,
        public pronouns: string,
    ) {
    }

    public static from(member: Member, { content: plural }: PluralMemberEntry) {
        return new MemberMeiliDoc(member.id, plural.name, member.description, plural.desc, plural.pronouns);
    }
}
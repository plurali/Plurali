import { MemberField } from "./MemberField";

export class System {
    constructor(
        public id: string,
        public lastModified: Date,
        public username: string,
        public fields: MemberField[],
        public color: string|null,
        public description: string|null,
        // TODO
        public avatar: null = null
    ) {}
}
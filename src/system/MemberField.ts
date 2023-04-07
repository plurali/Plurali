import { PluralVisibility } from "./PluralVisibility";
import {UserFieldDataDto} from "../db/UserFieldDataDto";

export class MemberField {
    constructor(
        public fieldId: string,
        public name: string,
        public position: number,
        public pluralVisibility: PluralVisibility,
        public data: UserFieldDataDto
    ) {}
}

export class MemberFieldWithValue extends MemberField {
    constructor(
        fieldId: string,
        name: string,
        position: number,
        pluralVisibility: PluralVisibility,
        data: UserFieldDataDto,
        public value: string
    ) {
        super(fieldId, name, position, pluralVisibility, data);
    }
}
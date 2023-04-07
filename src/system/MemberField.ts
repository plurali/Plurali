import { Visibility } from "./Visibility";

export class MemberField {
    constructor(
        public fieldId: string,
        public name: string,
        public position: number,
        public visibility: Visibility
    ) {}
}

export class MemberFieldWithValue extends MemberField {
    constructor(
        fieldId: string,
        name: string,
        position: number,
        visibility: Visibility,
        public value: string
    ) {
        super(fieldId, name, position, visibility);
    }
}
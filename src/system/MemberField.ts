import { Visibility } from "./Visibility";
import {UserFieldData} from "@prisma/client";

export class MemberField {
    constructor(
        public fieldId: string,
        public name: string,
        public position: number,
        public visibility: Visibility,
        public data: UserFieldData
    ) {}
}

export class MemberFieldWithValue extends MemberField {
    constructor(
        fieldId: string,
        name: string,
        position: number,
        visibility: Visibility,
        data: UserFieldData,
        public value: string
    ) {
        super(fieldId, name, position, visibility, data);
    }
}
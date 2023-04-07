import { PluralVisibility } from "./PluralVisibility";
import {UserFieldDataDto} from "../db/UserFieldDataDto";

export enum MemberFieldType {
    String = 'String',
    Color = 'Color',
    Date = 'Date',
    Month = 'Month',
    Year = 'Year',
    MonthYear = 'MonthYear',
    Timestamp = 'Timestamp',
    MonthDay = 'MonthDay'
}

export class MemberField {
    constructor(
        public fieldId: string,
        public name: string,
        public position: number,
        public type: MemberFieldType,
        public pluralVisibility: PluralVisibility,
        public data: UserFieldDataDto
    ) {}
}

export class MemberFieldWithValue extends MemberField {
    constructor(
        fieldId: string,
        name: string,
        position: number,
        type: MemberFieldType,
        pluralVisibility: PluralVisibility,
        data: UserFieldDataDto,
        public value: string
    ) {
        super(fieldId, name, position, type, pluralVisibility, data);
    }
}
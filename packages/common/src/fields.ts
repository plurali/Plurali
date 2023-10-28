import xss from 'xss';
import markdown from 'markdown-it';
import { MemberFieldType } from './enums';
import type { UserFieldDto as V1FieldDto } from "@plurali/pluraliapp/src/application/v1/dto/user/field/UserFieldDto";
import type { UserValueFieldDto as V1ValueFieldDto } from "@plurali/pluraliapp/src/application/v1/dto/user/field/UserValueFieldDto";
import type { FieldDtoInterface as V2FieldDto } from "@plurali/pluraliapp/src/application/v2/dto/field/FieldDtoInterface";
import type { ValueFieldDtoInterface as V2ValueFieldDto } from "@plurali/pluraliapp/src/application/v2/dto/field/ValueFieldDtoInterface";

export const formatString = (string: string, useMd = true): string =>
    useMd
        ? markdown({
            html: true,
            linkify: true,
            breaks: true,
            typographer: true,
        }).render(xss(string))
        : xss(string);

const formatColor = (string: string): string | null => {
    if (string && string.length >= 1) {
        string = xss(string);
        if (/^((#[a-fA-F0-9]{6})|(#[a-fA-F0-9]{8})|([a-fA-F0-9]{6})|([a-fA-F0-9]{8}))$/.test(string)) {
            return string;
        }
    }
    return null;
};

const formatDate = (string: string): string => new Date(xss(string)).toDateString();

const formatMonth = (string: string): string => new Date(xss(string)).toLocaleString('default', { month: 'long' });

const formatYear = (string: string): string => new Date(xss(string)).getFullYear().toString();

const formatMonthYear = (string: string): string => `${formatMonth(string)} ${formatYear(string)}`;

const formatTimestamp = (string: string): string => new Date(xss(string)).toLocaleString();

const formatMonthDay = (string: string): string => `${formatMonth(string)} ${new Date(xss(string)).getDate()}`;

export const fieldConvertors: Record<MemberFieldType, (val: string, md: boolean) => string | null> = {
    [MemberFieldType.String]: formatString,
    [MemberFieldType.Color]: formatColor,
    [MemberFieldType.Date]: formatDate,
    [MemberFieldType.Month]: formatMonth,
    [MemberFieldType.Year]: formatYear,
    [MemberFieldType.MonthYear]: formatMonthYear,
    [MemberFieldType.Timestamp]: formatTimestamp,
    [MemberFieldType.MonthDay]: formatMonthDay,
};

export function hasValue(value: V1FieldDto | V1ValueFieldDto | V2FieldDto | V2ValueFieldDto): value is V1ValueFieldDto | V2ValueFieldDto {
    return value.hasOwnProperty('value');
}

export const formatField = (field: V1ValueFieldDto | V2ValueFieldDto): string | null => {
    const fieldType: MemberFieldType = "type" in field ? field.type : field.fieldType;

    let str = fieldConvertors[fieldType]?.(field.value, true);

    // Distinguish empty strings
    if (!str || str.length <= 1) {
        str = '---';
    }

    return str;
};

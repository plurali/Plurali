import xss from 'xss';
import markdown from 'markdown-it';
import type { FieldDtoInterface } from '@app/v2/dto/field/FieldDtoInterface';
import type { ValueFieldDtoInterface } from '@app/v2/dto/field/ValueFieldDtoInterface';
import { MemberFieldType } from '@domain/plural/utils';

export const string = (string: string, useMd: boolean): string =>
  useMd
    ? markdown({
        html: true,
        linkify: true,
        breaks: true,
        typographer: true,
      }).render(xss(string))
    : xss(string);

const color = (string: string): string | null => {
  if (string && string.length >= 1) {
    string = xss(string);
    if (/^((#[a-fA-F0-9]{6})|(#[a-fA-F0-9]{8})|([a-fA-F0-9]{6})|([a-fA-F0-9]{8}))$/.test(string)) {
      return string;
    }
  }
  return null;
};

const date = (string: string): string => new Date(xss(string)).toDateString();

const month = (string: string): string => new Date(xss(string)).toLocaleString('default', { month: 'long' });

const year = (string: string): string => new Date(xss(string)).getFullYear().toString();

const monthYear = (string: string): string => {
  return `${month(string)} ${year(string)}`;
};

const timestamp = (string: string): string => new Date(xss(string)).toLocaleString();

const monthDay = (string: string): string => `${month(string)} ${new Date(xss(string)).getDate()}`;

export const fieldConvertors: Record<MemberFieldType, (val: string, md: boolean) => string | null> = {
  [MemberFieldType.String]: string,
  [MemberFieldType.Color]: color,
  [MemberFieldType.Date]: date,
  [MemberFieldType.Month]: month,
  [MemberFieldType.Year]: year,
  [MemberFieldType.MonthYear]: monthYear,
  [MemberFieldType.Timestamp]: timestamp,
  [MemberFieldType.MonthDay]: monthDay,
};

export function hasValue(value: FieldDtoInterface | ValueFieldDtoInterface): value is ValueFieldDtoInterface {
  return value.hasOwnProperty('value');
}

export const formatField = (field: ValueFieldDtoInterface): string | null => {
  let str = fieldConvertors[field.fieldType]?.(field.value, true);

  // Distinguish empty strings
  if (!str || str.length <= 1) {
    str = '---';
  }

  return str;
};

import xss from 'xss';
import markdown from 'markdown-it';
import type { UserFieldDto } from '@app/v1/dto/user/field/UserFieldDto';
import type { UserValueFieldDto } from '@app/v1/dto/user/field/UserValueFieldDto';
import { MemberFieldType } from '../../../src/domain/plural/utils';

const string = (string: string, useMd: boolean): string =>
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

const monthDay = (string: string): string => `${month(string)} ${new Date(xss(string)).getDay()}`;

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

export function hasValue(value: UserFieldDto | UserValueFieldDto): value is UserValueFieldDto {
  return value.hasOwnProperty('value');
}

export const formatField = (field: UserValueFieldDto): string | null => {
  let str = fieldConvertors[field.type]?.(field.value, true);

  // Distinguish empty strings
  if (!str || str.length <= 1) {
    str = '---';
  }

  return str;
};

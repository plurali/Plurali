import type { Logger } from '@nestjs/common';
import { Field, MemberFieldType as PrismaFieldType, System, User } from '@prisma/client';
import slugify from 'slugify';
import { BackgroundType as PrismaBackgroundType } from '@prisma/client';
import { MemberFieldType } from '@domain/plural/utils';
import { ObjectId } from 'bson';

export const id = <T = object, K extends keyof V = 'id', V extends Record<any, any> = Record<any, any>>(
  val: T | (V & { [key in K]: T }),
  key = 'id',
): T => (typeof val === 'object' ? (val as any)[key] : val);

export const safeStringify = (val: unknown) => {
  const seen = new WeakSet();
  return JSON.stringify(val, function (_, value) {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[circular]';
      }
      seen.add(value);
    }
    if (typeof value === 'bigint') {
      return value.toString() + 'n';
    }
    if (typeof value === 'undefined') {
      return '__undefined__';
    }
    return value;
  });
};

export const overrideLoggerPrefix = <T = Logger>(logger: T, prefix = 'Server'): T =>
  Object.assign(logger as any, {
    // https://github.com/nestjs/nest/blob/85966703ac57a5b263ab5807033f6ac78548c0ef/packages/common/services/console-logger.service.ts#L206-L208
    formatPid(pid: number) {
      return `[${prefix}] ${pid}  - `;
    },
  }) as T;

export const getRouteParam = (val: unknown | string | string[]): string => String(Array.isArray(val) ? val[0] : val);

export const isUrl = (url: string): boolean => {
  try {
    return !!new URL(url);
  } catch {
    return false;
  }
};

export const generateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const createSlug = (name: string) =>
  `${generateRandomString(6)}-${slugify(name, {
    lower: true,
  })}`;

export const assignUser = <T extends object, U extends User>(obj: T, user: U): T & { user: U } =>
  Object.assign({ user }, obj);

export const assignSystem = <T extends object, S extends System>(obj: T, system: S): T & { system: S } =>
  Object.assign({ system }, obj);

export const assignFields = <T extends object, F extends Field>(obj: T, fields: F[]): T & { fields: F[] } =>
  Object.assign({ fields }, obj);

export enum BackgroundType {
  Color = 'Color',
  Image = 'Image',
}

export enum OwnerType {
  Member = 'member',
  System = 'system',
}

export const convertBackgroundType = (type: PrismaBackgroundType): BackgroundType => BackgroundType[type];

export const convertFieldType = (type: PrismaFieldType): MemberFieldType => MemberFieldType[type];

export const isObjectId = (value: string) => {
  try {
    return new ObjectId(value).toString() === value;
  } catch {
    return false;
  }
};

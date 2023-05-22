import { Type } from '@nestjs/common';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ApiError, ApiErrorMessage } from '../dto/response/errors';

export const createRef = (type: Type | string) => `#/components/schemas/${typeof type === 'string' ? type : type.name}`;

export const ok = (status: number, type: Type | string | [Type | string]): { schema: SchemaObject; status: number } => {
  return {
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: false,
        },
        statusCode: {
          type: 'number',
          default: status,
        },
        data: Array.isArray(type) ? { type: 'array', items: { $ref: createRef(type[0]) } } : { $ref: createRef(type) },
        meta: {
          type: 'object',
        },
      },
    },
    status,
  };
};

const errorMap = Object.keys(ApiError).map(key => ApiError[key]);

export const error = (status: number, ...errors: string[]): { schema: SchemaObject; status: number } => {
  errors = errors.length >= 1 ? errors : errorMap;
  return {
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: false,
        },
        statusCode: {
          type: 'number',
          default: status,
        },
        error: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: errors,
            },
            message: {
              type: 'string',
              enum: errors.map(e => ApiErrorMessage[e]),
            },
          },
        },
        meta: {
          type: 'object',
        },
      },
    },
    status,
  };
};

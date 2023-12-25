import { StatusMap } from '@app/v1/dto/Status';
import { Type } from '@nestjs/common';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const createRef = (type: Type | string) => `#/components/schemas/${typeof type === 'string' ? type : type.name}`;

export const ok = (status: number, type: Type | string): { schema: SchemaObject; status: number } => {
  return {
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          default: true,
        },
        data: {
          $ref: createRef(type),
        },
      },
    },
    status,
  };
};

const statusMapEnum = Object.keys(StatusMap).map(key => StatusMap[key]);

export const error = (status: number, ...errors: string[]): { schema: SchemaObject; status: number } => ({
  schema: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        default: false,
      },
      error: {
        type: 'string',
        enum: errors.length < 1 ? statusMapEnum : errors,
      },
    },
  },
  status,
});

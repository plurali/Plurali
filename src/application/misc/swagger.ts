import { StatusMap } from '@app/v1/dto/Status';
import { Type } from '@nestjs/common';
import { DocumentBuilder } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const swagger = new DocumentBuilder()
  .setTitle('Plurali REST API')
  .setVersion('2.0')

  // V1
  .addTag('AuthV1')
  .addTag('UserV1')

  .addTag('SystemV1')
  .addTag('SystemPublicV1')
  .addTag('SystemFieldV1')

  .addTag('SystemMemberV1')
  .addTag('SystemMemberPublicV1')

  .addTag('SystemPageV1')
  .addTag('SystemPagePublicV1')

  .addTag('SystemMemberPageV1')
  .addTag('SystemMemberPagePublicV1')

  // V2
  .addTag('System')
  .addTag('SystemPage')
  .addTag('SystemFieldPublic')
  .addTag('SystemPagePublic')

  .addTag('Member')
  .addTag('MemberPage')
  .addTag('MemberFieldPublic')
  .addTag('MemberPagePublic')

  .addBearerAuth()

  .build();

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

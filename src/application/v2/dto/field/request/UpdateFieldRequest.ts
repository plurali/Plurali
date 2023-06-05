import { ApiProperty } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { UpdateFieldRequestInterface } from './UpdateFieldRequestInterface';

export class UpdateFieldRequest implements UpdateFieldRequestInterface {
  @IsEnum(Visibility)
  @IsOptional()
  @ApiProperty()
  public visibility: Visibility | null = null;
}

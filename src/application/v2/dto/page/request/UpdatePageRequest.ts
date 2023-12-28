import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UpdatePageRequestInterface } from './UpdatePageRequestInterface';
import { Visibility } from '@prisma/client';

export class UpdatePageRequest implements UpdatePageRequestInterface {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  public name: string | null = null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  public content: string | null = null;

  @IsEnum(Visibility)
  @IsOptional()
  @ApiProperty()
  public visibility: Visibility | null = null;
}

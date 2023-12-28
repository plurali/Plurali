import { ApiProperty } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';
import { IsEnum, IsHexColor, IsOptional, IsString } from 'class-validator';
import { UpdateSystemRequestInterface } from './UpdateSystemRequestInterface';

export class UpdateSystemRequest implements UpdateSystemRequestInterface {
  @IsEnum(Visibility)
  @IsOptional()
  @ApiProperty()
  public visibility: Visibility | null = null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public description: string | null = null;

  @IsHexColor()
  @IsOptional()
  @ApiProperty()
  public backgroundColor: string | null = null;
}

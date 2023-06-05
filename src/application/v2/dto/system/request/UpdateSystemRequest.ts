import { ApiProperty } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';
import { IsBoolean, IsEnum, IsHexColor, IsOptional, IsString } from 'class-validator';
import { UpdateSystemRequestInterface } from './UpdateSystemRequestInterface';

export class UpdateSystemRequest implements UpdateSystemRequestInterface {
  @IsBoolean()
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

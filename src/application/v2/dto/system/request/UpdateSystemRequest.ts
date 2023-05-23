import { ApiProperty } from '@nestjs/swagger';
import { Visibility } from '@prisma/client';
import { IsBoolean, IsEnum, IsHexColor, IsOptional, IsString } from 'class-validator';

export class UpdateSystemRequest {
  @IsBoolean()
  @IsEnum(Visibility)
  @IsOptional()
  @ApiProperty()
  public visibility: Visibility | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public description?: string | null;

  @IsHexColor()
  @IsOptional()
  @ApiProperty()
  public backgroundColor?: string | null;
}

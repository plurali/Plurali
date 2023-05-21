import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsHexColor, IsOptional, IsString } from 'class-validator';

export class UpdateSystemRequest {
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public visible: boolean | null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public customDescription?: string | null;

  @IsHexColor()
  @IsOptional()
  @ApiProperty()
  public backgroundColor?: string | null;
}

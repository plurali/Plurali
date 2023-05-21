import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePageRequest {
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

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  public visible: boolean | null = null;
}

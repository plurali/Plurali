import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UpdatePageRequestInterface } from './UpdatePageRequestInterface';

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

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  public visible: boolean | null = null; // TODO
}

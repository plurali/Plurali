import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { CreatePageRequestInterface } from './CreatePageRequestInterface';

export class CreatePageRequest implements CreatePageRequestInterface {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public content: string;

  @IsBoolean()
  @ApiProperty()
  public visible: boolean; // TODO
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CreatePageRequestInterface } from './CreatePageRequestInterface';
import { Visibility } from '@prisma/client';

export class CreatePageRequest implements CreatePageRequestInterface {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public content: string;

  @IsEnum(Visibility)
  @IsNotEmpty()
  @ApiProperty()
  public visibility: Visibility;
}

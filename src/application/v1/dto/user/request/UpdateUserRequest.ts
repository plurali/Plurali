import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @MinLength(32)
  @IsOptional()
  @ApiProperty()
  public pluralKey: string | null = null;

  @IsString()
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  public email: string | null = null;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public overridePluralId: string | null = null;
}

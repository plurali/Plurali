import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { UpdateUserRequestInterface } from './UpdateUserRequestInterface';

export class UpdateUserRequest implements UpdateUserRequestInterface {
  @IsString()
  @MinLength(32)
  @IsOptional()
  @ApiProperty()
  public accessToken: string | null = null;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Admin-only (for debugging/testing)' })
  public systemIdOverride: string | null = null;
}

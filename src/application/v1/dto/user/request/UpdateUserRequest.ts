import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(32)
  @IsOptional()
  public pluralKey: string | null = null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public overridePluralId: string | null = null;
}

import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @MinLength(32)
  @IsOptional()
  public pluralKey: string | null = null;

  @IsString()
  @IsOptional()
  public overridePluralId: string | null = null;
}

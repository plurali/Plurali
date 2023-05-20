import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePageRequest {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public name: string | null = null;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public content: string | null = null;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  public visible: boolean | null = null;
}

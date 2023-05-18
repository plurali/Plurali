import { IsBoolean, IsHexColor, IsOptional, IsString } from 'class-validator';

export class UpdateSystemMemberRequest {
  @IsBoolean()
  @IsOptional()
  public visible: boolean | null;

  @IsString()
  @IsOptional()
  public customDescription?: string | null;

  @IsHexColor()
  @IsOptional()
  public backgroundColor?: string | null;
}

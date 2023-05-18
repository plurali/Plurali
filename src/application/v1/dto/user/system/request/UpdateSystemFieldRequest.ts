import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSystemFieldRequest {
  @IsBoolean()
  @IsOptional()
  public visible: boolean | null = null;
}

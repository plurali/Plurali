import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSystemFieldRequest {
  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public visible: boolean | null = null;
}

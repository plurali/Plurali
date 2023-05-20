import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePageRequest {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public content: string;

  @IsBoolean()
  public visible: boolean;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRequestBody {
  @IsString()
  @IsNotEmpty()
  public username: string;

  @IsString()
  @IsNotEmpty()
  public password: string;
}

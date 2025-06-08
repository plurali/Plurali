import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

import { VerificationRequest } from "../../partials/VerificationRequest";
import { ResetPasswordRequestInterface } from "./ResetPasswordRequestInterface";

export class ResetPasswordRequest extends VerificationRequest implements ResetPasswordRequestInterface {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public password: string;
}

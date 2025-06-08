import { Trim } from "@app/common/validation/Trim";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

import { AuthRequest } from "./AuthRequest";

export class RegisterRequest extends AuthRequest {
  @IsString()
  @IsEmail()
  @Trim()
  @ApiProperty()
  public email: string;
}

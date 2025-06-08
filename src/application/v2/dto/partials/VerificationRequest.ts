import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { VerificationRequestInterface } from "./VerificationRequestInterface";

export class VerificationRequest implements VerificationRequestInterface {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public code: string;
}

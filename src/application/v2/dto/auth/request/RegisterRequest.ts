import { IsEmail, IsString } from "class-validator";
import { AuthRequest } from "./AuthRequest";
import { ApiProperty } from "@nestjs/swagger";
import { Trim } from "@app/common/validation/Trim";
import { RegisterRequestInterface } from "./RegisterRequestInterface";

export class RegisterRequest extends AuthRequest implements RegisterRequestInterface {
    @IsString()
    @IsEmail()
    @Trim()
    @ApiProperty()
    email: string;
}
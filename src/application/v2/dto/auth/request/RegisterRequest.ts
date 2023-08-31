import { IsEmail, IsString } from "class-validator";
import { AuthRequest } from "./AuthRequest";
import { ApiProperty } from "@nestjs/swagger";
import { Trim } from "@app/common/validation/Trim";

export class RegisterRequest extends AuthRequest {
    @IsString()
    @IsEmail()
    @Trim()
    @ApiProperty()
    email: string;
}
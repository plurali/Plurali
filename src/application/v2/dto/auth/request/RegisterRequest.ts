import { IsEmail, IsString } from "class-validator";
import { AuthRequest } from "./AuthRequest";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterRequest extends AuthRequest {
    @IsString()
    @IsEmail()
    @ApiProperty()
    email: string;
}
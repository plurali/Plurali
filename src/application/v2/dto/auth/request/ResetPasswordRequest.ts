import { IsNotEmpty, IsString } from "class-validator";
import { ResetPasswordRequestInterface } from "./ResetPasswordRequestInterface";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordRequest implements ResetPasswordRequestInterface {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    code: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    public password: string;
}
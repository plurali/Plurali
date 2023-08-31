import { IsNotEmpty, IsString } from "class-validator";
import { VerifyUserEmailRequestInterface } from "./VerifyUserEmailRequestInterface";

export class VerifyUserEmailRequest implements VerifyUserEmailRequestInterface {
    @IsString()
    @IsNotEmpty()
    public code: string;
}
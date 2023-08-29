import { AuthRequestInterface } from "./AuthRequestInterface";

export interface RegisterRequestInterface extends AuthRequestInterface {
    email: string;
}
import { VerificationRequestInterface } from '../../partials/VerificationRequestInterface';

export interface ResetPasswordRequestInterface extends VerificationRequestInterface {
  email: string;
  password: string;
}

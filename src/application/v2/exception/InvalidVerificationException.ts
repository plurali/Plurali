import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class InvalidVerificationException extends ApiException {
  constructor(error = ApiError.InvalidVerification, status = 400) {
    super(error, status);
  }
}

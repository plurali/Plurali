import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class InvalidCredentialsException extends ApiException {
  constructor(error = ApiError.InvalidCredentials, status = 401) {
    super(error, status);
  }
}

import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class UsernameTakenException extends ApiException {
  constructor(error = ApiError.UsernameTaken, status = 400) {
    super(error, status);
  }
}

import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class UsernameOrEmailTakenException extends ApiException {
  constructor(error = ApiError.UsernameOrEmailTaken, status = 400) {
    super(error, status);
  }
}

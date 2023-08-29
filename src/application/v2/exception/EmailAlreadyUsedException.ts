import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class EmailAlreadyUsedException extends ApiException {
  constructor(error = ApiError.EmailAlreadyUsed, status = 400) {
    super(error, status);
  }
}

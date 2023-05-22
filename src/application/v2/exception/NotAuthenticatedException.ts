import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class NotAuthenticatedException extends ApiException {
  constructor(error = ApiError.NotAuthenticated, status = 401) {
    super(error, status);
  }
}

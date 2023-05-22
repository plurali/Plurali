import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class UnauthorizedException extends ApiException {
  constructor(error = ApiError.Unauthorized, status = 401) {
    super(error, status);
  }
}

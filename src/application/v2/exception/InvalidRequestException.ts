import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class InvalidRequestException extends ApiException {
  constructor(error = ApiError.InvalidRequest, status = 400) {
    super(error, status);
  }
}

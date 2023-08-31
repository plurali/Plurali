import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class SystemAlreadyAssociatedException extends ApiException {
  constructor(error = ApiError.SystemAlreadyAssociated, status = 400) {
    super(error, status);
  }
}

import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class ResourceNotFoundException extends ApiException {
  constructor(error = ApiError.ResourceNotFound, status = 404) {
    super(error, status);
  }
}

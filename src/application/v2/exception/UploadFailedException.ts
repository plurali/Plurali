import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class UploadFailedException extends ApiException {
  constructor(error = ApiError.UploadFailed, status = 400) {
    super(error, status);
  }
}

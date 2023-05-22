import { ApiError } from '../dto/response/errors';
import { ApiException } from './ApiException';

export class UnsupportedFileException extends ApiException {
  constructor(error = ApiError.UnsupportedFile, status = 400) {
    super(error, status);
  }
}

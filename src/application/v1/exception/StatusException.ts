import { HttpException, HttpExceptionOptions } from '@nestjs/common';
import { Status, StatusMap } from '../dto/Status';

export class StatusException extends HttpException {
  constructor(message: string = StatusMap.InvalidRequest, status = 400, options?: HttpExceptionOptions) {
    super(Status.error(message), status, options);
  }
}

import { StatusMap } from '../dto/Status';
import { StatusException } from './StatusException';

export class InvalidRequestException extends StatusException {
  constructor(message = StatusMap.InvalidRequest, status = 400) {
    super(message, status);
  }
}

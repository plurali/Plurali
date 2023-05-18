import { StatusMap } from '../dto/Status';
import { StatusException } from './StatusException';

export class UnauthorizedException extends StatusException {
  constructor(message = StatusMap.Unauthorized, status = 401) {
    super(message, status);
  }
}

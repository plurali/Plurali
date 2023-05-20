import { StatusMap } from '../dto/Status';
import { StatusException } from './StatusException';

export class NotAuthenticatedException extends StatusException {
  constructor(message = StatusMap.NotAuthenticated, status = 401) {
    super(message, status);
  }
}

import { StatusMap } from '../dto/Status';
import { StatusException } from './StatusException';

export class ResourceNotFoundException extends StatusException {
  constructor(message = StatusMap.ResourceNotFound, status = 404) {
    super(message, status);
  }
}

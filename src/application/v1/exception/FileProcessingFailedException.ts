import { StatusMap } from '../dto/Status';
import { StatusException } from './StatusException';

export class FileProcessingFailedException extends StatusException {
  constructor(message = StatusMap.FileProcessingFailed, status = 400) {
    super(message, status);
  }
}

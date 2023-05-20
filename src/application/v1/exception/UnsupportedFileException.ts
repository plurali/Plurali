import { StatusMap } from '../dto/Status';
import { StatusException } from './StatusException';

export class UnsupportedFileException extends StatusException {
  constructor(message = StatusMap.UnsupportedFile, status = 400) {
    super(message, status);
  }
}

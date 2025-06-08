import { StatusMap } from "../dto/Status";
import { StatusException } from "./StatusException";

export class SystemAlreadyAssociatedException extends StatusException {
  constructor(message = StatusMap.SystemAlreadyAssociated, status = 400) {
    super(message, status);
  }
}

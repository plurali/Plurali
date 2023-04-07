import { Exception } from "./Exception";

export class ValidationException extends Exception {
    name = "ValidationException"
}

export class UnexpectedValueException extends ValidationException {
    name = "UnexpectedValueException"

    constructor(expected: any, got: any) {
        super(`Expected type: ${String(expected)}, got: ${String(got)} of type '${typeof got}'`)
    }
}
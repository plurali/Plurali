import { Exception } from './Exception'

export class EnvMissingException extends Exception {
  name = 'EnvMissingException'
}

export class EnvNotFoundException extends Exception {
  name = 'EnvNotFoundException'

  constructor(key: string) {
    super(`Missing environment variable: ${key}`)
  }
}

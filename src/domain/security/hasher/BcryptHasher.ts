import * as bcrypt from "bcrypt";

import { Hasher } from "./Hasher";

export class BcryptHasher extends Hasher {
  hash(plain: string): string {
    return bcrypt.hashSync(plain, 10);
  }

  verify(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }
}

import { Hasher } from './Hasher';
import bcrypt from 'bcrypt';

export class BcryptHasher extends Hasher {
  hash(plain: string): string {
    return bcrypt.hashSync(plain, 10);
  }

  verify(plain: string, hash: string): boolean {
    return bcrypt.compareSync(plain, hash);
  }
}

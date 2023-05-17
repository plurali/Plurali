export abstract class Hasher {
  abstract hash(plain: string): string;

  abstract verify(plain: string, hash: string): boolean;
}

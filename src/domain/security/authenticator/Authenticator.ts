export abstract class Authenticator<C = object, U = object> {
  abstract attempt(credentials: C): Promise<U | null>;
}

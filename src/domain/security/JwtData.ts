export interface JwtDataInterface {
  user: string;
}

export class JwtData implements JwtDataInterface {
  constructor(public readonly user: string) {}
}

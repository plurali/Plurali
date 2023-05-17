import { User, System, Member, Field, BackgroundType } from '@prisma/client';

export interface SystemWithUser<U extends User = User> extends System {
  user: U;
}

export interface SystemWithFields<F extends Field = Field> extends System {
  fields: F[];
}

export interface SystemWithCollections<M extends Member = Member, F extends Field = Field> extends System {
  members: M[];
  fields: F[];
}

export interface FullSystem<U extends User = User, M extends Member = Member, F extends Field = Field>
  extends SystemWithUser<U>,
    SystemWithCollections<M, F> {}

export interface UserWithSystem<S extends System | undefined = System | undefined> extends User {
  system: S;
}
undefined;

export type FullUser<S extends System | undefined = System | undefined> = UserWithSystem<S>;

export interface MemberWithSystem<S extends System = System> extends Member {
  system: S;
}

export interface HasBackground {
  backgroundType: BackgroundType;
  backgroundImage: string | null;
  backgroundColor: string | null;
}

export interface Transformable<R> {
  transform(): Promise<R>;
}

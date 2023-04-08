import { User } from '@prisma/client'
export class UserDataDto {
  constructor(public slug: string | null, public description: string | null, public visible: boolean) {}

  public static from(user: User): UserDataDto {
    return new this(user.slug, user.description, user.visible)
  }
}

import { User } from '@prisma/client'
export class UserDataDto {
  constructor(public slug: string | null, public customDescription: string | null, public visible: boolean) {}

  public static from(user: User): UserDataDto {
    return new this(user.slug, user.customDescription, user.visible)
  }
}

import { UserMember } from '@prisma/client'

export class UserMemberDataDto {
  constructor(public slug: string | null, public description: string | null, public visible: boolean) {}

  public static from(userMember: UserMember): UserMemberDataDto {
    return new this(userMember.slug, userMember.description, userMember.visible)
  }
}

import { UserMember } from '@prisma/client'

export class UserMemberDataDto {
  constructor(
    public slug: string | null, 
    public customDescription: string | null, 
    public visible: boolean
    ) {}

  public static from(userMember: UserMember): UserMemberDataDto {
    return new this(userMember.slug, userMember.customDescription, userMember.visible)
  }
}

import { UserMember } from '@prisma/client';
import { Background, BackgroundData } from '../data/index.js';

export class UserMemberDataDto implements BackgroundData {
  constructor(
    public slug: string | null,
    public backgroundType: Background,
    public backgroundColor: string | null,
    public backgroundImage: string | null,
    public customDescription: string | null,
    public visible: boolean
  ) {}

  public static from(userMember: UserMember): UserMemberDataDto {
    return new this(
      userMember.slug,
      Background[userMember.backgroundType],
      userMember.backgroundColor,
      userMember.backgroundImage,
      userMember.customDescription,
      userMember.visible
    );
  }
}

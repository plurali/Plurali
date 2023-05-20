import { BackgroundType } from '@domain/common';
import { HasBackground } from '@domain/common/types';
import { Member, Visibility } from '@prisma/client';

/**
 * @deprecated
 */
export class UserMemberDataDto implements HasBackground {
  constructor(
    public slug: string | null,
    public backgroundType: BackgroundType,
    public backgroundColor: string | null,
    public backgroundImage: string | null,
    public customDescription: string | null,
    public lastTimeAssetChanged: Date,
    public visible: boolean
  ) {}

  public static from(systemMember: Member): UserMemberDataDto {
    return new this(
      systemMember.slug,
      systemMember.backgroundType as BackgroundType,
      systemMember.backgroundColor,
      systemMember.backgroundImage,
      systemMember.description,
      systemMember.assetsUpdatedAt,
      systemMember.visibility === Visibility.Public
    );
  }
}

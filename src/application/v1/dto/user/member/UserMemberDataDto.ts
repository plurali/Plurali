import { BackgroundType } from '@domain/common';
import { HasBackground } from '@domain/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { Member, Visibility } from '@prisma/client';

/**
 * @deprecated
 */
export class UserMemberDataDto implements HasBackground {
  @ApiProperty()
  public slug: string | null;

  @ApiProperty()
  public backgroundType: BackgroundType;

  @ApiProperty()
  public backgroundColor: string | null;

  @ApiProperty()
  public backgroundImage: string | null;

  @ApiProperty()
  public customDescription: string | null;

  @ApiProperty()
  public lastTimeAssetChanged: Date;

  @ApiProperty()
  public visible: boolean;

  constructor(
    slug: string | null,
    backgroundType: BackgroundType,
    backgroundColor: string | null,
    backgroundImage: string | null,
    customDescription: string | null,
    lastTimeAssetChanged: Date,
    visible: boolean,
  ) {
    this.slug = slug;
    this.backgroundType = backgroundType;
    this.backgroundColor = backgroundColor;
    this.backgroundImage = backgroundImage;
    this.customDescription = customDescription;
    this.lastTimeAssetChanged = lastTimeAssetChanged;
    this.visible = visible;
  }

  public static from(systemMember: Member): UserMemberDataDto {
    return new this(
      systemMember.slug,
      systemMember.backgroundType as BackgroundType,
      systemMember.backgroundColor,
      systemMember.backgroundImage,
      systemMember.description,
      systemMember.assetsUpdatedAt,
      systemMember.visibility === Visibility.Public,
    );
  }
}

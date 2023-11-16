import { convertBackgroundType } from '@domain/common';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Member, Visibility } from '@prisma/client';
import { BackgroundData } from '../partials/BackgroundData';
import { MemberDataDtoInterface } from './MemberDataDtoInterface';
import { BackgroundDataInterface } from '../partials/BackgroundDataInterface';

@ApiExtraModels(BackgroundData)
export class MemberDataDto implements MemberDataDtoInterface {
  @ApiProperty()
  public slug: string | null;

  @ApiProperty()
  public description: string | null;

  @ApiProperty()
  public assetsUpdatedAt: Date;

  @ApiProperty()
  public visibility: Visibility;

  @ApiProperty({ type: BackgroundData })
  public background: BackgroundDataInterface;

  constructor(
    slug: string | null,
    description: string | null,
    assetsUpdatedAt: Date,
    visibility: Visibility,
    background: BackgroundDataInterface,
  ) {
    this.slug = slug;
    this.description = description;
    this.assetsUpdatedAt = assetsUpdatedAt;
    this.visibility = visibility;
    this.background = background;
  }

  public static from(member: Member): MemberDataDto {
    return new this(
      member.slug,
      member.description,
      member.assetsUpdatedAt,
      member.visibility,
      BackgroundData.from({
        ...member,
        backgroundType: convertBackgroundType(member.backgroundType),
      }),
    );
  }
}

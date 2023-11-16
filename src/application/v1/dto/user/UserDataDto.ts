import { BackgroundType } from '@domain/common';
import { HasBackground } from '@domain/common/types';
import { System, Visibility } from '@prisma/client';

/**
 * @deprecated v2 - UserData->System
 */
export class UserDataDto implements HasBackground {
  public slug: string | null;

  public customDescription: string | null;

  public backgroundType: BackgroundType;

  public backgroundColor: string | null;

  public backgroundImage: string | null;

  public lastTimeAssetChanged: Date;

  public visible: boolean;

  constructor(
    slug: string | null,
    customDescription: string | null,
    backgroundType: BackgroundType,
    backgroundColor: string | null,
    backgroundImage: string | null,
    lastTimeAssetChanged: Date,
    visible: boolean,
  ) {
    this.slug = slug;
    this.customDescription = customDescription;
    this.backgroundType = backgroundType;
    this.backgroundColor = backgroundColor;
    this.backgroundImage = backgroundImage;
    this.lastTimeAssetChanged = lastTimeAssetChanged;
    this.visible = visible;
  }

  public static from(system: System): UserDataDto {
    return new this(
      system.slug,
      system.description,
      system.backgroundType as BackgroundType,
      system.backgroundColor,
      system.backgroundImage,
      system.assetsUpdatedAt,
      system.visibility === Visibility.Public,
    );
  }
}

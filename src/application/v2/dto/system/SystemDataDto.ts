import { convertBackgroundType } from '@domain/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { System, Visibility } from '@prisma/client';
import { BackgroundData } from '../partials/BackgroundData';
import { SystemDataDtoInterface } from './SystemDataDtoInterface';

@ApiExtraModels(BackgroundData)
export class SystemDataDto implements SystemDataDtoInterface {
  public slug: string | null;

  public description: string | null;

  public background: BackgroundData;

  public assetsUpdatedAt: Date;

  public visibility: Visibility;

  constructor(
    slug: string | null,
    description: string | null,
    background: BackgroundData,
    assetsUpdatedAt: Date,
    visibility: Visibility,
  ) {
    this.slug = slug;
    this.description = description;
    this.background = background;
    this.assetsUpdatedAt = assetsUpdatedAt;
    this.visibility = visibility;
  }

  public static from(system: System): SystemDataDto {
    return new SystemDataDto(
      system.slug,
      system.description,
      BackgroundData.from({
        ...system,
        backgroundType: convertBackgroundType(system.backgroundType),
      }),
      system.assetsUpdatedAt,
      system.visibility,
    );
  }
}

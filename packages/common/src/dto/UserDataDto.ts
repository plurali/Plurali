import { User } from '@prisma/client';
import { Background, BackgroundData } from '../data/index.js';

export class UserDataDto implements BackgroundData {
  constructor(
    public slug: string | null,
    public customDescription: string | null,
    public backgroundType: Background,
    public backgroundColor: string | null,
    public backgroundImage: string | null,
    public lastTimeAssetChanged: Date,
    public visible: boolean
  ) {}

  public static from(user: User): UserDataDto {
    return new this(user.slug, user.customDescription, Background[user.backgroundType], user.backgroundColor, user.backgroundImage, user.lastTimeAssetChanged, user.visible);
  }
}

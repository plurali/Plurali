import { BackgroundType } from '@domain/common';
import { HasBackground } from '@domain/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { BackgroundDataInterface } from './BackgroundDataInterface';

export class BackgroundData implements BackgroundDataInterface {
  @ApiProperty()
  public type: BackgroundType;

  @ApiProperty()
  public color: string | null;

  @ApiProperty()
  public image: string | null;

  constructor(type: BackgroundType, color: string | null, image: string | null) {
    this.type = type;
    this.color = color;
    this.image = image;
  }

  public static from(data: HasBackground): BackgroundData {
    return new BackgroundData(data.backgroundType, data.backgroundColor, data.backgroundImage);
  }
}

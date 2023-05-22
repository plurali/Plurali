import { Page, Visibility } from '@prisma/client';
import { OwnerType } from '@domain/common';
import { ApiProperty } from '@nestjs/swagger';

export class PageDto {
  @ApiProperty()
  public id: string;

  @ApiProperty()
  public ownerType: OwnerType;

  @ApiProperty()
  public ownerId: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public content: string;

  @ApiProperty()
  public visible: boolean;

  constructor(id: string, ownerType: OwnerType, ownerId: string, name: string, content: string, visible: boolean) {
    this.id = id;
    this.ownerType = ownerType;
    this.ownerId = ownerId;
    this.name = name;
    this.content = content;
    this.visible = visible;
  }

  public static from(page: Page): PageDto {
    return new PageDto(
      page.id,
      page.ownerType.toLowerCase() as OwnerType,
      page.ownerId,
      page.name,
      page.content,
      page.visibility === Visibility.Public
    );
  }
}

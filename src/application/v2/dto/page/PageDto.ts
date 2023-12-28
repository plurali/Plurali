import { OwnerType, Page, Visibility } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { PageDtoInterface } from './PageDtoInterface';

export class PageDto implements PageDtoInterface {
  @ApiProperty({ default: 'page' })
  public type = 'page';

  @ApiProperty()
  public id: string;

  @ApiProperty()
  public ownerType: OwnerType;

  @ApiProperty()
  public ownerId: string;

  @ApiProperty()
  public name: string;

  @ApiProperty()
  public slug: string;

  @ApiProperty()
  public content: string;

  @ApiProperty()
  public visibility: Visibility;

  constructor(
    id: string,
    ownerType: OwnerType,
    ownerId: string,
    name: string,
    slug: string,
    content: string,
    visibility: Visibility,
  ) {
    this.id = id;
    this.ownerType = ownerType;
    this.ownerId = ownerId;
    this.name = name;
    this.slug = slug;
    this.content = content;
    this.visibility = visibility;
  }

  public static from(page: Page): PageDto {
    return new PageDto(page.id, page.ownerType, page.ownerId, page.name, page.slug, page.content, page.visibility);
  }
}

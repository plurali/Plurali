import { Page, Visibility } from '@prisma/client';
import { OwnerType } from '@domain/common';

export class PageDto {
  constructor(
    public id: string,
    public ownerType: OwnerType,
    public ownerId: string,
    public name: string,
    public content: string,
    public visible: boolean
  ) {}

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

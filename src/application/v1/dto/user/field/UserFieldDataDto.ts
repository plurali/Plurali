import { ApiProperty } from '@nestjs/swagger';
import { Field, Visibility } from '@prisma/client';

/**
 * @deprecated v2 - merged -> UserFieldDto
 */
export class UserFieldDataDto {
  @ApiProperty()
  public visible: boolean;

  constructor(visible: boolean) {
    this.visible = visible;
  }

  public static from(userField: Field): UserFieldDataDto {
    return new this(userField.visibility === Visibility.Public);
  }
}

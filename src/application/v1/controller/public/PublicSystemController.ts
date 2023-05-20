import { Controller, Get, Param } from '@nestjs/common';
import { SystemRepository } from '@domain/system/SystemRepository';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { Ok, Status } from '@app/v1/dto/Status';
import { SystemDto } from '@app/v1/dto/user/system/SystemDto';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { InvalidRequestException } from '@app/v1/exception/InvalidRequestException';

@Controller({
  path: '/public/system',
  version: '1',
})
export class PublicSystemController {
  constructor(private system: SystemRepository, private plural: PluralRestService) {}

  @Get('/:systemId')
  public async view(@Param('systemId') id: string): Promise<Ok<Record<'system', SystemDto>>> {
    const system = await this.system.findPublic(id);

    if (!system) {
      throw new ResourceNotFoundException();
    }

    const plural = await this.plural.findUserForId(system.pluralId, system.user.pluralAccessToken);

    if (!plural) {
      throw new InvalidRequestException();
    }

    return Status.ok({
      system: SystemDto.from(system, plural),
    });
  }
}

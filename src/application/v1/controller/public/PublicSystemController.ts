import { Controller, Get, Param } from '@nestjs/common';
import { SystemRepository } from '@domain/system/SystemRepository';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { Ok, Status } from '@app/v1/dto/Status';
import { SystemDto } from '@app/v1/dto/user/system/SystemDto';

@Controller({
  path: '/public/system/:systemId',
  version: '1',
})
export class PublicSystemController {
  constructor(private system: SystemRepository, private plural: PluralRestService) {}

  @Get('/')
  public async view(@Param('systemId') id: string): Promise<Ok<Record<'system', SystemDto>>> {
    const system = await this.system.findPublic(id);
    const plural = await this.plural.findUser(system, true);

    return Status.ok({
      system: SystemDto.from(system, plural),
    });
  }
}

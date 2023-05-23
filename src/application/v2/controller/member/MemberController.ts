import { ApiExtraModels, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BackgroundType, Member, Prisma, System, User, Visibility } from '@prisma/client';
import { FileInterceptor, UploadedFile, MemoryStorageFile } from '@blazity/nest-file-fastify';
import * as mime from 'mime-types';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { assignSystem, assignUser } from '@domain/common';
import { SystemWithUser } from '@domain/common/types';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { StorageService } from '@infra/storage/StorageService';
import { StoragePrefix } from '@infra/storage/StoragePrefix';
import { MemberDto } from '@app/v2/dto/member/MemberDto';
import { error, ok } from '@app/v2/misc/swagger';
import { ApiError } from '@app/v2/dto/response/errors';
import { InvalidRequestException } from '@app/v2/exception/InvalidRequestException';
import { PluralCachedRestService } from '@domain/plural/PluralCachedRestService';
import { ApiDataResponse, ApiPaginatedDataResponse } from '@app/v2/types/response';
import { Page } from '@app/v2/context/pagination/Page';
import { Take } from '@app/v2/context/pagination/Take';
import { ResourceNotFoundException } from '@app/v2/exception/ResourceNotFoundException';
import { UnsupportedFileException } from '@app/v2/exception/UnsupportedFileException';
import { UploadFailedException } from '@app/v2/exception/UploadFailedException';
import { ApiWarning } from '@app/v2/dto/response/warning';
import { UpdateMemberRequest } from '@app/v2/dto/member/request/UpdateMemberRequest';
import { SystemGuard } from '@app/v2/context/system/SystemGuard';
import { CurrentSystem } from '@app/v2/context/system/CurrentSystem';
import { CurrentUser } from '@app/v2/context/auth/CurrentUser';
import { BaseController } from '../BaseController';

@Controller({
  path: '/member',
  version: '2',
})
@ApiTags('Member')
@ApiSecurity('bearer')
@ApiExtraModels(MemberDto)
export class MemberController extends BaseController {
  constructor(
    private readonly members: MemberRepository,
    @Inject(PluralRestService) private readonly plural: PluralCachedRestService,
    private readonly storage: StorageService
  ) {
    super();
  }

  @UseGuards(SystemGuard)
  @Get('/')
  @HttpCode(200)
  @ApiResponse(ok(200, [MemberDto]))
  @ApiResponse(error(400, ApiError.InvalidPluralKey, ApiError.InvalidRequest))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  public async list(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Page() page: number,
    @Take() take: number
  ): Promise<ApiPaginatedDataResponse<MemberDto>> {
    const query = this.createPaginationQuery(page, take);

    const members = await this.members.findMany({
      where: {
        systemId: system.id,
      },
      ...query,
    });

    return this.paginated(
      await this.makeDtos(members, await this.makeSystemWithUser(system, user)),
      200,
      query,
      await this.members.count({
        where: { systemId: system.id },
      })
    );
  }

  @UseGuards(SystemGuard)
  @Get('/:id')
  @HttpCode(200)
  @ApiResponse(ok(200, MemberDto))
  @ApiResponse(error(400, ApiError.InvalidPluralKey, ApiError.InvalidRequest))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  public async view(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string
  ): Promise<ApiDataResponse<MemberDto>> {
    return this.data(
      await this.makeDto(await this.findOrFail(system, id), await this.makeSystemWithUser(system, user))
    );
  }

  @UseGuards(SystemGuard)
  @Patch('/:member')
  @HttpCode(200)
  @ApiResponse(ok(200, MemberDto))
  @ApiResponse(error(400, ApiError.InvalidPluralKey, ApiError.InvalidRequest))
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  public async update(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('member') memberId: string,
    @Body() data: UpdateMemberRequest
  ): Promise<ApiDataResponse<MemberDto>> {
    let member = await this.findOrFail(system, memberId);

    const update: Prisma.MemberUpdateInput = {};

    if (notEmpty(data.visibility)) {
      update.visibility = Object.values(Visibility).includes(data.visibility) ? data.visibility : Visibility.Private;
    }

    if (data.description !== null) {
      update.description = data.description;
    }

    if (notEmpty(data.backgroundColor)) {
      update.backgroundType = BackgroundType.Color;
      update.backgroundColor = data.backgroundColor;
    }

    if (shouldUpdate(update)) {
      member = await this.members.update({
        where: {
          id: member.id,
        },
        data: update,
      });
    }

    return this.data(await this.makeDto(member, await this.makeSystemWithUser(system, user)));
  }

  @Post('/:member/background')
  @UseGuards(SystemGuard)
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @ApiResponse(ok(200, MemberDto))
  @ApiResponse(
    error(400, ApiError.InvalidPluralKey, ApiError.InvalidRequest, ApiError.UnsupportedFile, ApiError.UploadFailed)
  )
  @ApiResponse(error(401, ApiError.NotAuthenticated))
  async updateBackground(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('member') memberId: string,
    @UploadedFile() file: MemoryStorageFile
  ) {
    let member = await this.findOrFail(system, memberId);

    if (!file.mimetype.startsWith('image/')) {
      throw new UnsupportedFileException();
    }

    const key = `${StoragePrefix.Userdata}/${user.id}/${system.id}/${member.id}/background.${mime.extension(
      file.mimetype
    )}`;

    const result = await this.storage.store(key, file.buffer, true);
    if (!result.ok) {
      throw new UploadFailedException();
    }

    member = await this.members.update({
      where: {
        id: member.id,
      },
      data: {
        backgroundType: BackgroundType.Image,
        backgroundImage: key,
        assetsUpdatedAt: new Date(),
      },
    });

    return this.data(
      await this.makeDto(member, await this.makeSystemWithUser(system, user)),
      200,
      result.cacheFail ? { warning: ApiWarning.CacheDemand } : {}
    );
  }

  protected async findOrFail(system: System, id: string): Promise<Member> {
    const member = await this.members.findFirst({
      where: {
        systemId: system.id,
        pluralId: id,
      },
    });

    if (!member) {
      throw new ResourceNotFoundException();
    }

    return member;
  }

  protected async makeSystemWithUser(system: System, user: User): Promise<SystemWithUser> {
    return assignUser(system, user);
  }

  protected async makeDto(member: Member, system: SystemWithUser): Promise<MemberDto> {
    const extendedMember = assignSystem(member, system);

    const pluralMember = await this.plural.findMember(extendedMember);
    if (!pluralMember) {
      throw new InvalidRequestException();
    }

    return MemberDto.from(extendedMember, pluralMember);
  }

  protected async makeDtos(members: Member[], system: SystemWithUser): Promise<MemberDto[]> {
    const plurals = await this.plural.findSpecificMembers(system, members);
    return members
      .map(member => {
        const plural = plurals.get(member.pluralId);
        return plural ? MemberDto.from(assignSystem(member, system), plural) : null;
      })
      .filter(m => !!m);
  }
}

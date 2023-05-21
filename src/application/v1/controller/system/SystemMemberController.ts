import { CurrentUser } from '@app/context/auth/CurrentUser';
import { CurrentSystem } from '@app/context/system/CurrentSystem';
import { SystemGuard } from '@app/context/system/SystemGuard';
import { notEmpty, shouldUpdate } from '@app/misc/request';
import { Ok, Status, StatusMap } from '@app/v1/dto/Status';
import { UserMemberDto } from '@app/v1/dto/user/member/UserMemberDto';
import { UpdateSystemMemberRequest } from '@app/v1/dto/user/system/request/UpdateSystemMemberRequest';
import { SystemMemberResponse } from '@app/v1/dto/user/system/response/SystemMemberResponse';
import { SystemMembersResponse } from '@app/v1/dto/user/system/response/SystemMembersResponse';
import { InvalidRequestException } from '@app/v1/exception/InvalidRequestException';
import { ResourceNotFoundException } from '@app/v1/exception/ResourceNotFoundException';
import { assignFields, assignSystem, assignUser } from '@domain/common';
import { SystemWithFields, SystemWithUser } from '@domain/common/types';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { PluralMemberEntry } from '@domain/plural/types/rest/members';
import { FieldRepository } from '@domain/system/field/FieldRepository';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { BackgroundType, Member, Prisma, System, User, Visibility } from '@prisma/client';
import { FileInterceptor, UploadedFile, MemoryStorageFile } from '@blazity/nest-file-fastify';
import { StorageService } from '@infra/storage/StorageService';
import { UnsupportedFileException } from '@app/v1/exception/UnsupportedFileException';
import { StoragePrefix } from '@infra/storage/StoragePrefix';
import { FileProcessingFailedException } from '@app/v1/exception/FileProcessingFailedException';
import * as mime from 'mime-types';
import { ApiExtraModels, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { error, ok } from '@app/misc/swagger';

@Controller({
  path: '/system/members',
  version: '1',
})
@ApiTags('SystemMember')
@ApiSecurity('bearer')
@ApiExtraModels(SystemMemberResponse, SystemMembersResponse)
export class SystemMemberController {
  constructor(
    private readonly members: MemberRepository,
    private readonly fields: FieldRepository,
    private readonly rest: PluralRestService,
    private readonly storage: StorageService
  ) {}

  @UseGuards(SystemGuard)
  @Get('/')
  @ApiResponse(ok(200, SystemMembersResponse))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey, StatusMap.InvalidRequest))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  public async list(@CurrentSystem() system: System, @CurrentUser() user: User): Promise<Ok<SystemMembersResponse>> {
    const members = await this.members.findMany({
      where: {
        systemId: system.id,
      },
    });

    const extendedSystem = await this.makeExtendedSystem(system, user);

    const plural = await this.rest.findMembers(extendedSystem);

    const dtoMembers: UserMemberDto[] = [];

    for (const member of members) {
      const dto = await this.makeDto(member, extendedSystem, plural);

      dtoMembers.push(dto);
    }

    return Status.ok(new SystemMembersResponse(dtoMembers));
  }

  @UseGuards(SystemGuard)
  @Get('/:id')
  @ApiResponse(ok(200, SystemMemberResponse))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey, StatusMap.InvalidRequest))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  public async view(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string
  ): Promise<Ok<SystemMemberResponse>> {
    return Status.ok(
      new SystemMemberResponse(
        await this.makeDto(await this.findOrFail(system, id), await this.makeExtendedSystem(system, user))
      )
    );
  }

  @UseGuards(SystemGuard)
  @Post('/:id')
  @ApiResponse(ok(200, SystemMemberResponse))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey, StatusMap.InvalidRequest))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  public async update(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() data: UpdateSystemMemberRequest
  ): Promise<Ok<SystemMemberResponse>> {
    let member = await this.findOrFail(system, id);

    const update: Prisma.MemberUpdateInput = {};

    if (notEmpty(data.visible)) {
      update.visibility = data.visible ? Visibility.Public : Visibility.Private;
    }

    if (data.customDescription !== null) {
      update.description = data.customDescription;
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

    return Status.ok(new SystemMemberResponse(await this.makeDto(member, await this.makeExtendedSystem(system, user))));
  }

  @Post('/:id/background')
  @UseGuards(SystemGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse(ok(200, SystemMemberResponse))
  @ApiResponse(error(400, StatusMap.InvalidPluralKey, StatusMap.InvalidRequest))
  @ApiResponse(error(401, StatusMap.NotAuthenticated))
  async updateBackground(
    @CurrentSystem() system: System,
    @CurrentUser() user: User,
    @Param('id') id: string,
    @UploadedFile() file: MemoryStorageFile
  ) {
    let member = await this.findOrFail(system, id);

    if (!file.mimetype.startsWith('image/')) {
      throw new UnsupportedFileException();
    }

    const key = `${StoragePrefix.Userdata}/${user.id}/${system.id}/${member.id}/background.${mime.extension(
      file.mimetype
    )}`;

    const result = await this.storage.store(key, file.buffer, true);
    if (!result.ok) {
      throw new FileProcessingFailedException();
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

    const warning = result.cacheFail ? StatusMap.CacheDemand : undefined;

    return Status.ok(
      new SystemMemberResponse(await this.makeDto(member, await this.makeExtendedSystem(system, user)), warning)
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

  protected async makeExtendedSystem(system: System, user: User): Promise<SystemWithFields & SystemWithUser> {
    return assignFields(
      assignUser(system, user),
      await this.fields.findMany({
        where: {
          systemId: system.id,
        },
      })
    );
  }

  protected async makeDto(
    member: Member,
    system: SystemWithFields & SystemWithUser,
    plural?: PluralMemberEntry[]
  ): Promise<UserMemberDto> {
    const extendedMember = assignSystem(member, system);

    let pluralMember = plural ? plural.find(m => m.id === member.pluralId) : null;
    if (!pluralMember) {
      // Attempt to fetch alone
      pluralMember = await this.rest.findMember(extendedMember);

      if (!pluralMember) {
        throw new InvalidRequestException();
      }
    }

    return UserMemberDto.from(extendedMember, pluralMember);
  }
}

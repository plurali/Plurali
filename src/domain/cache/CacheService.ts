import { ConsoleLogger, Inject, Injectable } from '@nestjs/common';
import { System, Member, UserRole, Visibility, User } from '@prisma/client';
import { CacheRepository } from '@infra/cache/CacheRepository';
import { CacheNamespace } from '@infra/cache/utils';
import { createSlug } from '@domain/common';
import { UserRepository } from '@domain/user/UserRepository';
import { PluralRestService } from '@domain/plural/PluralRestService';
import { SystemWithUser, UserWithSystem } from '@domain/common/types';
import { SystemRepository } from '@domain/system/SystemRepository';
import { PluralUserEntry } from '@domain/plural/types/rest/user';
import { FieldRepository } from '@domain/system/field/FieldRepository';
import { PluralVisibility, parseFieldType, parseVisibility } from '@domain/plural/utils';
import { MemberRepository } from '@domain/system/member/MemberRepository';
import { PluralMemberEntry } from '@domain/plural/types/rest/members';
import { PrismaTx } from '@infra/prisma/types';

@Injectable()
export class CacheService {
  constructor(
    private readonly repository: CacheRepository,
    private readonly user: UserRepository,
    private readonly field: FieldRepository,
    private readonly system: SystemRepository,
    private readonly member: MemberRepository,
    private readonly logger: ConsoleLogger,
    @Inject('PluralResetServiceBase') private readonly plural: PluralRestService
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async rebuildMembers(system: SystemWithUser) {
    const pluralMembers = await this.plural.findMembers(system);

    return await this.member.prisma.$transaction(async client => {
      // Delete all members that are not listed by SP anymore
      await client.member.deleteMany({
        where: {
          pluralId: {
            notIn: pluralMembers.map(member => member.id),
          },
        },
      });

      const members = [];

      for (const plural of pluralMembers) {
        members.push(await this.rebuildMember(system, plural, client));
      }

      return members;
    });
  }

  async rebuildMember(system: System, plural: PluralMemberEntry, prisma?: PrismaTx) {
    prisma = prisma ?? this.member.prisma;

    const visible = parseVisibility(plural.content) === PluralVisibility.Public;

    const data = {
      pluralId: plural.id,
      pluralParentId: plural.content.uid,
    };

    return await prisma.member.upsert({
      where: {
        pluralId: plural.id,
      },
      update: data,
      create: {
        ...data,
        systemId: system.id,
        slug: createSlug(plural.content.uid),
        visibility: visible ? Visibility.Public : Visibility.Private,
      },
    });
  }

  async rebuildFields(system: System, plural: PluralUserEntry) {
    return await this.field.prisma.$transaction(async client => {
      // Delete all fields that are not listed by SP anymore
      await client.field.deleteMany({
        where: {
          pluralId: {
            notIn: Object.keys(plural.content.fields),
          },
        },
      });

      const fields = [];

      for (const pluralId in plural.content.fields) {
        const field = plural.content.fields[pluralId];
        const visible = parseVisibility(field) === PluralVisibility.Public;

        const data = {
          name: field.name,
          type: parseFieldType(field),
          pluralId: pluralId,
          pluralParentId: plural.id,
          systemId: system.id,
        };

        fields.push(
          await client.field.upsert({
            where: {
              pluralId,
            },
            create: {
              ...data,
              visibility: visible ? Visibility.Public : Visibility.Private,
            },
            update: data,
          })
        );
      }

      return fields;
    });
  }

  async rebuildFor(user: User & { system?: System }): Promise<void> {
    await this.clearSystem(user.system);

    let pluralUser: PluralUserEntry | null = null;
    try {
      pluralUser = await this.plural.findUserForId(
        'me',
        user.pluralAccessToken,
        user.role === UserRole.Admin && user.pluralOverride
      );
    } catch (error) {
      this.logger.error(`Failed to get data for ${user.id}`, error);
    }

    if (!pluralUser.content.isAsystem) {
      pluralUser = null;
    }

    if (!pluralUser) {
      await this.system.delete({
        where: {
          userId: user.id,
        },
      });

      await this.user.update({
        where: {
          id: user.id,
        },
        data: {
          pluralOverride: null,
          pluralAccessToken: null,
        },
      });

      return;
    }

    if (!user.system) {
      // Attempt to fetch system if not passed
      user.system = await this.system.findUnique({
        where: {
          userId: user.id,
        },
      });
    }

    if (user.system && user.system.pluralId !== pluralUser.id) {
      await this.system.delete({
        where: {
          id: user.system.id,
        },
      });
    }

    user = await this.user.update({
      where: {
        id: user.id,
      },
      data: {
        system: {
          upsert: {
            update: {},
            create: {
              slug: createSlug(pluralUser.content.username),
              pluralId: pluralUser.id,
              visibility: Visibility.Private,
            },
          },
        },
      },
      include: {
        system: true,
      },
    });

    await this.rebuildMembers(Object.assign(user.system, { user }));
    await this.rebuildFields(user.system, pluralUser);
  }

  async rebuild(): Promise<void> {
    this.logger.log('Starting a cache rebuild job');
    await Promise.all(
      (
        await this.user.findMany({
          include: {
            system: {
              include: {
                members: true,
                fields: true,
                user: true,
              },
            },
          },
        })
      ).map(async user => {
        await this.rebuildFor(user);
      })
    );
  }

  static createSystemKey(system: System) {
    return CacheRepository.createKey(CacheNamespace.System, `SystemSID${system.pluralId}`);
  }

  static createMemberListKey(system: System) {
    return CacheRepository.createKey(CacheNamespace.MemberList, `SystemSID${system.pluralId}`);
  }

  static createMemberKey(member: Member) {
    return CacheRepository.createKey(
      CacheNamespace.Member,
      `SystemSID${member.pluralParentId}_MemberSID${member.pluralId}`
    );
  }

  async clearSystem(system: System): Promise<void> {
    const keys = await this.repository.cache.store.keys(`*SystemSID${system.pluralId}*`);
    const t = this.repository.cache.store.client.multi();

    keys.forEach(key => t.del(key));

    await t.exec();
  }

  async clearMemberList(system: System): Promise<void> {
    await this.repository.delete(CacheNamespace.MemberList, `SystemSID${system.pluralId}`);
  }

  async clearMember(member: Member): Promise<void> {
    await this.repository.delete(
      CacheNamespace.Member,
      `SystemSID${member.pluralParentId}_MemberSID${member.pluralId}`
    );
  }
}

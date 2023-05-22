import { Injectable } from '@nestjs/common';
import { PluralRestService } from './PluralRestService';
import { ConfigService } from '@nestjs/config';
import { Config } from '@app/Config';
import { PluralMemberEntry } from './types/rest/members';
import { PluralUserEntry } from './types/rest/user';
import { CacheRepository } from '@infra/cache/CacheRepository';
import { CacheNamespace } from '@infra/cache/utils';
import { MemberWithSystem, SystemWithUser } from '@domain/common/types';
import { Member } from '@prisma/client';
import { assignSystem } from '@domain/common';

@Injectable()
export class PluralCachedRestService extends PluralRestService {
  constructor(config: ConfigService<Config>, private readonly cache: CacheRepository) {
    super(config);
  }

  async findMembers(system: SystemWithUser): Promise<PluralMemberEntry[]> {
    return (
      await this.cache.lazy<PluralMemberEntry[]>(
        CacheNamespace.MemberList,
        `PluraliUser${system.user.id}_OwnerSID${system.pluralId}`,
        () => super.findMembers(system),
        30000,
        async function (members, ns, k, e) {
          await this.store(ns, k, members, e);
          for (const member of members) {
            await this.store(CacheNamespace.Member, `${k}_MemberSID${member.id}`, member, e);
          }
          return members;
        }
      )
    ).data;
  }

  async findSpecificMembers(system: SystemWithUser, members: Member[]): Promise<Map<string, PluralMemberEntry>> {
    if (members.length <= 1) return new Map();

    const key = (m: Member) => `PluraliUser${system.user.id}_OwnerSID${system.pluralId}_MemberSID${m.pluralId}`;

    const result = new Map(
      Object.entries(
        (
          await this.cache.cache.store.mget(
            ...members.map(m => CacheRepository.createKey(CacheNamespace.Member, key(m)))
          )
        )
          .map(data => {
            const obj: PluralMemberEntry | null = typeof data === 'string' ? JSON.parse(data) : null;
            if (!obj) return null;

            return { [obj.id]: obj };
          })
          .filter(data => !!data)
          .reduce((prev, curr) => Object.assign(prev, curr), {})
      )
    );

    (
      await Promise.all(
        members
          .filter(m => !result.has(m.pluralId))
          .map(async m => {
            const data = await super.findMember(assignSystem(m, system));
            if (!data) return null;

            await this.cache.store(CacheNamespace.Member, key(m), data, 30000);

            return data;
          })
          .filter(data => !!data)
      )
    ).forEach(r => result.set(r.id, r));

    return result;
  }

  async findMember(member: MemberWithSystem<SystemWithUser>): Promise<PluralMemberEntry> {
    return (
      await this.cache.lazy<PluralMemberEntry>(
        CacheNamespace.Member,
        `PluraliUser${member.system.user.id}_OwnerSID${member.pluralParentId}_MemberSID${member.pluralId}`,
        () => super.findMember(member)
      )
    ).data;
  }

  async findUserForId(userId: string, Authorization: string, override?: string): Promise<PluralUserEntry> {
    return (
      await this.cache.lazy<PluralUserEntry>(
        CacheNamespace.System,
        `PluraliUser${userId}_Override${override ?? 'Unset'}`,
        () => super.findUserForId(userId, Authorization, override)
      )
    ).data;
  }
}

import { Config, PluralConfig } from '@app/Config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PluralMemberEntry } from './types/rest/members';
import { UserRole } from '@prisma/client';
import { MemberWithSystem, SystemWithUser } from '@domain/common/types';
import { PluralUserEntry } from './types/rest/user';

@Injectable()
export class PluralRestService {
  private readonly httpClient: AxiosInstance;

  constructor(config: ConfigService<Config>) {
    this.httpClient = axios.create({
      baseURL: config.get<PluralConfig>('plural').apiEndpoint,
    });
  }

  async findMembers(system: SystemWithUser): Promise<PluralMemberEntry[]> {
    return system.user.pluralAccessToken
      ? await this.findMembersForId(system.pluralId, system.user.pluralAccessToken)
      : [];
  }

  async findMembersForId(systemId: string, Authorization: string): Promise<PluralMemberEntry[]> {
    try {
      return (
        await this.httpClient.request<PluralMemberEntry[]>({
          url: `/v1/members/${systemId}`,
          method: 'GET',
          headers: {
            Authorization,
          },
        })
      ).data;
    } catch {
      return [];
    }
  }

  async findMember(member: MemberWithSystem<SystemWithUser>): Promise<PluralMemberEntry | null> {
    return await this.findMemberForId(member.pluralId, member.pluralParentId, member.system.user.pluralAccessToken);
  }

  async findMemberForId(memberId: string, systemId: string, Authorization: string): Promise<PluralMemberEntry | null> {
    try {
      return (
        await this.httpClient.request<PluralMemberEntry>({
          url: `/v1/member/${systemId}/${memberId}`,
          method: 'GET',
          headers: {
            Authorization,
          },
        })
      ).data;
    } catch {
      return null;
    }
  }

  async findUser(system: SystemWithUser, enableOverride = false): Promise<PluralUserEntry | null> {
    return await this.findUserForId(
      system.pluralId,
      system.user.pluralAccessToken,
      (enableOverride && system.user.role === UserRole.Admin && system.user.pluralOverride) ?? undefined
    );
  }

  async findUserForId(
    userId: string | 'me',
    Authorization: string,
    override?: string
  ): Promise<PluralUserEntry | null> {
    try {
      return (
        await this.httpClient.request<PluralUserEntry>({
          url: !override && userId === 'me' ? `/v1/me` : `/v1/user/${override ?? userId}`,
          method: 'GET',
          headers: {
            Authorization,
          },
        })
      ).data;
    } catch {
      return null;
    }
  }
}

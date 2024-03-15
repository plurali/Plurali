import axios, { AxiosInstance } from 'axios';
import { PluralMemberEntry } from './types/rest/members';
import { PluralUserEntry } from './types/rest/user';

export interface PluralRestClientConfig {
  apiEndpoint: string;
}

export class PluralRestService {
  private readonly httpClient: AxiosInstance;

  constructor(config: PluralRestClientConfig) {
    this.httpClient = axios.create({
      baseURL: config.apiEndpoint,
    });
  }

  async getMembers(systemId: string, Authorization: string): Promise<PluralMemberEntry[]> {
    try {
      return (
        await this.httpClient.request<PluralMemberEntry[]>({
          url: `/members/${systemId}`,
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

  async getMember(memberId: string, systemId: string, Authorization: string): Promise<PluralMemberEntry | null> {
    try {
      return (
        await this.httpClient.request<PluralMemberEntry>({
          url: `/member/${systemId}/${memberId}`,
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

  async getUser(
    userId: string | 'me',
    Authorization: string,
  ): Promise<PluralUserEntry | null> {
    try {
      const data = (
        await this.httpClient.request<PluralUserEntry>({
          url: userId === "me" ? `/me` : `/user/${userId}`,
          method: 'GET',
          headers: {
            Authorization,
          },
        })
      ).data;

      return data;
    } catch {
      return null;
    }
  }
}

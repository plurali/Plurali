import { DigitalOceanConfig } from '@app/Config';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class DigitalOceanService {
  protected readonly config: DigitalOceanConfig | null;

  protected readonly httpClient: AxiosInstance;

  constructor(protected readonly logger: Logger, config: ConfigService) {
    this.config = config.get<DigitalOceanConfig | null>('digitalocean');
    this.httpClient = axios.create({
      baseURL: 'https://api.digitalocean.com/v2',
      headers: {
        Authorization: this.config.apiToken ? `Bearer ${this.config.apiToken}` : null,
      },
    });
  }

  async clearCdnCache(path: string): Promise<boolean> {
    if (!this.config) {
      this.logger.log(`Skipping cache clear request for '${path}'`);
    }

    try {
      await this.httpClient.request({
        method: 'DELETE',
        url: `https://api.digitalocean.com/v2/cdn/endpoints/${this.config.endpointId}/cache`,
        data: {
          files: [path],
        },
      });

      return true;
    } catch (e) {
      const message =
        (typeof e === 'object' && ((e as any)?.response?.data?.error ?? (e as any)?.message)) ?? '(unknown)';

      this.logger.warn(`Failed to purge cache for ${path}, cause: ${message}`);

      return false;
    }
  }
}

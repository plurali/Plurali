import axios from 'axios';
import { $env } from '../utils/env.js';
import { $server } from '../server/index.js';

export const clearCdnCache = async (path: string): Promise<boolean> => {
  const bearer = $env('DO_API_TOKEN');
  const endpointId = $env('DO_ENDPOINT_ID');

  if (!bearer || !endpointId) return false;

  try {
    await axios.request({
      method: 'DELETE',
      url: `https://api.digitalocean.com/v2/cdn/endpoints/${endpointId}/cache`,
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
      data: {
        files: [path],
      },
    });
    return true;
  } catch (e) {
    const message = e?.response?.data?.error ?? e?.message ?? '(unknown)';

    $server.log.warn(`[digitalocean] failed to purge cache for ${path}: ${message}`);
    return false;
  }
};

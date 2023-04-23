import { $env } from './utils/env.js';
import { $db } from './services/db/index.js';
import { $server } from './server/index.js';
import { $storage } from './services/s3/index.js';
import { $watcherBag } from './ws/watcher/bag.js';
import { ensureSchemaIntegrity } from './services/db/schema.js';

const run = async () => {
  /**
   * Initialize database connection
   */
  await $db.$connect();
  await ensureSchemaIntegrity();

  /**
   * Initialize s3
   */
  await $storage.ensureInitialIntegrity();

  /**
   * Websocket watchers
   */
  await $watcherBag.init();

  /**
   * Start the webserver
   */
  await $server.listen({
    host: $env.orFail('HOST'),
    port: $env.num('PORT'),
  });
};

run();

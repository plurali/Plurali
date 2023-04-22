import { $env } from './utils/env';
import { $db } from './services/db';
import { $server } from './server';
import { $storage } from './services/s3';
import { $watcherBag } from './ws/watcher/bag';

const run = async () => {
  /**
   * Initialize database connection
   */
  await $db.$connect();

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

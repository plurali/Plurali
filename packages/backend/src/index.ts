import { $env } from './utils/env'
import { $db } from './services/db'
import { $server } from './server'
import { $storage } from './services/s3'

const run = async () => {
  /**
   * Initialize database connection
   */
  await $db.$connect()

  /**
   * Initialize s3
   */
  await $storage.ensureInitialIntegrity()

  /**
   * Start the webserver
   */
  await $server.listen({
    host: $env.orFail('HOST'),
    port: $env.num('PORT'),
  })
}

run()

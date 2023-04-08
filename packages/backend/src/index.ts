import { $env } from './utils/env'
import { $db } from './services/db'
import { $server } from './server'

const run = async () => {
  /**
   * Initialize database connection
   */
  await $db.$connect()

  /**
   * Start the webserver
   */
  await $server.listen({
    host: $env.orFail('HOST'),
    port: $env.num('PORT'),
  })
}

run()

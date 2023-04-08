import { $env } from './Env'
import { $db } from './db'
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
    host: $env.get('HOST', true),
    port: $env.num('PORT'),
  })
}

run()

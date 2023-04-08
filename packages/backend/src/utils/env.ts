import dotenv from 'dotenv'

export interface Variables {
  NODE_ENV: string
  HOST: string
  PORT: string
  CORS_ORIGIN: string
  REDIS_HOST: string
  REDIS_PASS: string
}

let dotenvData = dotenv.config()

let _env: Record<string, string> = {
  ...process.env,
  ...(!dotenvData.error ? dotenvData.parsed ?? {} : {}),
}

function $env(key: keyof Variables): Variables[typeof key] | null {
  const value = (_env as unknown as Variables)[key]
  return value ?? null
}

$env.orFail = (key: keyof Variables): Variables[typeof key] => {
  const value = $env(key)
  if (!value) throw new Error(`Undefined environment variable ${value}`)

  return value
}

$env.bool = (key: keyof Variables): boolean => $env.orFail(key) === 'true'

$env.num = (key: keyof Variables): number => {
  const value = $env.orFail(key)
  const parsed = Number(value)
  if (isNaN(parsed))
    throw new Error(
      `Expected numeric value in ${key}, got '${value}' (typeof ${typeof value})`
    )

  return parsed
}

$env.dev = $env('NODE_ENV') === 'development'

$env.prod = !$env.dev

export { $env }

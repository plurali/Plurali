import dotenv from 'dotenv'
import path from 'path'
import { __root } from '../constants'

export interface Variables {
  NODE_ENV: string
  HOST: string
  PORT: string
  CORS_ORIGIN: string
  REDIS_HOST: string
  REDIS_PASS: string
  S3_ENDPOINT: string
  S3_ACCESS_KEY_ID: string
  S3_ACCESS_KEY_SECRET: string
  S3_BUCKET: string
  S3_REGION: string
}

let _env: Record<string, string> |null= null;

function $env(key: keyof Variables): Variables[typeof key] | null {
  if (!_env) {
    const dotenvData = dotenv.config({
      path: path.join(__root, "..", "..", ".env")
    });
    
    _env = {
      ...process.env as any,
      ...(!dotenvData.error ? dotenvData.parsed ?? {} : {}) as any,
    }
  }
  const value = (_env as unknown as Variables)[key]
  return value ?? null
}

$env.orFail = (key: keyof Variables): Variables[typeof key] => {
  const value = $env(key)
  if (!value) throw new Error(`Undefined environment variable '${key}'`)

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

import { writeFileSync } from 'fs'
import slugify from 'slugify'
import sodium from 'sodium-native'

export const generateRandomString = (length: number) => {
  let result = ''
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const createSlug = (name: string) =>
  `${generateRandomString(6)}-${slugify(name, {
    lower: true,
  })}`

export const createSecret = (path: string) => {
  const buffer = Buffer.allocUnsafe(sodium.crypto_secretbox_KEYBYTES)
  sodium.randombytes_buf(buffer)
  writeFileSync(path, buffer)
}

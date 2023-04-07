import { writeFileSync } from "fs"
import sodium from "sodium-native"

export const createSecret = (path: string) => {
    const buffer = Buffer.allocUnsafe(sodium.crypto_secretbox_KEYBYTES)
    sodium.randombytes_buf(buffer)
    writeFileSync(path, buffer);
}
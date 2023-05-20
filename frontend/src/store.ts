import { ref } from 'vue'
import type { UserDto } from '@app/v1/dto/user/UserDto'

export enum FlashType {
  Danger = 'bg-red-700 text-white',
  Warning = 'bg-yellow-600 text-white',
  Success = 'bg-green-700 text-white',
  Info = 'bg-blue-700 text-white',
}

export interface Flash {
  type: FlashType
  message: string
  removeOnNextRedirect: boolean
}

export const flashes = ref<Flash[]>([])

export const flash = (message: string = 'An error has occurred, please refresh the site.', type: FlashType = FlashType.Danger, clear = true, removeOnNextRedirect = true) => {
  const f: Flash = {
    message,
    type,
    removeOnNextRedirect
  }

  if (clear) {
    flashes.value = [f]
  } else {
    flashes.value.push(f)
  }

  return f
}

export const nextRedirect = () => {
  flashes.value = flashes.value.filter(flash => !flash.removeOnNextRedirect).map(flash => ({
    ...flash,
    removeOnNextRedirect: true
  }))
}

export const clearFlashes = () => (flashes.value = [])

export const background = ref<string | null>(null)

export const goBack = ref<string | null>(null)

export const user = ref<UserDto | null>(null)

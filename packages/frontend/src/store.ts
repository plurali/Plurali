import { ref } from 'vue'
import { UserDto } from '@plurali/common/src/dto'

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

export const flash = (message: string, type: FlashType = FlashType.Info, clear = false, removeOnNextRedirect = true) => {
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

export const bgColor = ref<string | null>(null)

export const goBack = ref<string | null>(null)

export const user = ref<UserDto | null>(null)

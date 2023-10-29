import { UserDtoInterface } from '@plurali/api-client';
import { ref } from 'vue'

export enum FlashType {
  Danger = 'Danger',
  Warning = 'Warning',
  Success = 'Success',
  Info = 'Info',
}

export interface Flash {
  color: FlashType|string;
  message: string;
  removeOnNextRedirect: boolean;
}

export const flashes = ref<Flash[]>([])

export const flash = (message: string = 'An error has occurred, please refresh the site.', typeOrColor: FlashType | string = FlashType.Danger, clear = true, removeOnNextRedirect = true) => {
  const f: Flash = {
    message,
    color: typeOrColor,
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

export const user = ref<UserDtoInterface | null>(null)

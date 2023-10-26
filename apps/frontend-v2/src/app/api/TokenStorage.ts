import { hasWindow } from '../utils';

export class TokenStorage {
  constructor(public readonly storageKey: string) {}

  get(): string | null {
    return hasWindow() ? localStorage.getItem(this.storageKey) ?? null : null;
  }

  set(value: string | null): void {
    if (!hasWindow()) return;

    if (value) {
      localStorage.setItem(this.storageKey, value);
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  clear() {
    this.set(null);
  }
}

export const $tokenStorage = new TokenStorage('_plurali_auth');

export class TokenStorage {
  constructor(public readonly storageKey: string) {}

  get(): string | null {
    return typeof window !== "undefined" ? localStorage.getItem(this.storageKey) ?? null : null;
  }

  set(value: string | null): void {
    if (typeof window === "undefined") return;

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

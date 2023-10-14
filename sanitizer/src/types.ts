import type { Sanitizer } from '.';

export interface SanitizerConfig {
  allowElements?: string[];
  blockElements?: string[];
  dropElements?: string[];
  allowAttributes?: string[] | Record<string, string[]>;
  dropAttributes?: string[] | Record<string, string[]>;
  allowCustomElements?: boolean;
  allowComments?: boolean;
}

export interface SetHTMLOptions {
  sanitizer?: Sanitizer;
}

declare global {
  interface Window {
    [Sanitizer.GLOBALNAME]: typeof Sanitizer;
  }

  interface HTMLElement {
    [Sanitizer.SETTER_NAME](input: string, opt?: SetHTMLOptions): void;
  }
}

import { Sanitizer } from '.';
import type { SetHTMLOptions } from './types';

export function setHTML(this: HTMLElement, input: string, opt?: SetHTMLOptions) {
  let sanitizerObj: Sanitizer | undefined = opt && opt.sanitizer;
  if (!sanitizerObj || !(sanitizerObj instanceof Sanitizer)) {
    sanitizerObj = new Sanitizer();
  }
  const inactiveDocument = document.implementation.createHTMLDocument();
  const context = inactiveDocument.createElement(this.localName);
  context.innerHTML = input;
  Sanitizer.sanitizeDocFragment(sanitizerObj.getConfiguration(), context);
  this.replaceChildren(...Array.from(context.childNodes));
};

export const polyfill = (force = false) => {
  if (typeof window === 'undefined' || !window.isSecureContext) {
    return;
  }

  if (!force && typeof window[Sanitizer.GLOBALNAME] === 'function') {
    console.warn("Skipping Sanitizer polyfill as it's available natively.");
    return;
  }

  window[Sanitizer.GLOBALNAME] = Sanitizer;

  HTMLElement.prototype[Sanitizer.SETTER_NAME] = setHTML
};

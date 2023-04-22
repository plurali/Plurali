import { Sanitizer } from '.';
import type { SetHTMLOptions } from './types';

export const polyfill = () => {
  if (typeof window === 'undefined' || !window.isSecureContext) {
    return;
  }

  if (typeof window[Sanitizer.GLOBALNAME] === 'function' && location.hash.indexOf('mustpolyfill') === -1) {
    console.warn("Skipping Sanitizer polyfill as it's available natively.");
    return;
  }

  window[Sanitizer.GLOBALNAME] = Sanitizer;

  HTMLElement.prototype[Sanitizer.SETTER_NAME] = function setHTML(input: string, opt?: SetHTMLOptions) {
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
};

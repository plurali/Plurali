// https://raw.githubusercontent.com/mozilla/sanitizer-polyfill/main/src/sanitizer.js
import DOMPurify from 'dompurify';
import type { SanitizerConfig } from './types';

const SUPPORTED_CONFIGURATION_LISTS = new Set([
  'allowElements',
  'blockElements',
  'dropElements',
  'allowAttributes',
  'dropAttributes',
  'allowCustomElements',
  'allowComments',
]);

// from https://wicg.github.io/sanitizer-api/#constants
const DEFAULT_ALLOWED_ELEMENTS = new Set([
  'a',
  'abbr',
  'acronym',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'basefont',
  'bdi',
  'bdo',
  'bgsound',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'center',
  'cite',
  'code',
  'col',
  'colgroup',
  'command',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'em',
  'fieldset',
  'figcaption',
  'figure',
  'font',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'image',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'layer',
  'legend',
  'li',
  'link',
  'listing',
  'main',
  'map',
  'mark',
  'marquee',
  'menu',
  'meta',
  'meter',
  'nav',
  'nobr',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'picture',
  'plaintext',
  'popup',
  'portal',
  'pre',
  'progress',
  'q',
  'rb',
  'rp',
  'rt',
  'rtc',
  'ruby',
  's',
  'samp',
  'section',
  'select',
  'selectmenu',
  'slot',
  'small',
  'source',
  'span',
  'strike',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'tt',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
]);

const DEFAULT_ALLOWED_ATTRIBUTES = [
  'abbr',
  'accept',
  'accept-charset',
  'accesskey',
  'action',
  'align',
  'alink',
  'allow',
  'allowfullscreen',
  'allowpaymentrequest',
  'alt',
  'anchor',
  'archive',
  'as',
  'async',
  'autocapitalize',
  'autocomplete',
  'autocorrect',
  'autofocus',
  'autopictureinpicture',
  'autoplay',
  'axis',
  'background',
  'behavior',
  'bgcolor',
  'border',
  'bordercolor',
  'capture',
  'cellpadding',
  'cellspacing',
  'challenge',
  'char',
  'charoff',
  'charset',
  'checked',
  'cite',
  'class',
  'classid',
  'clear',
  'code',
  'codebase',
  'codetype',
  'color',
  'cols',
  'colspan',
  'compact',
  'content',
  'contenteditable',
  'controls',
  'controlslist',
  'conversiondestination',
  'coords',
  'crossorigin',
  'csp',
  'data',
  'datetime',
  'declare',
  'decoding',
  'default',
  'defer',
  'dir',
  'direction',
  'dirname',
  'disabled',
  'disablepictureinpicture',
  'disableremoteplayback',
  'disallowdocumentaccess',
  'download',
  'draggable',
  'elementtiming',
  'enctype',
  'end',
  'enterkeyhint',
  'event',
  'exportparts',
  'face',
  'for',
  'form',
  'formaction',
  'formenctype',
  'formmethod',
  'formnovalidate',
  'formtarget',
  'frame',
  'frameborder',
  'headers',
  'height',
  'hidden',
  'high',
  'href',
  'hreflang',
  'hreftranslate',
  'hspace',
  'http-equiv',
  'id',
  'imagesizes',
  'imagesrcset',
  'importance',
  'impressiondata',
  'impressionexpiry',
  'incremental',
  'inert',
  'inputmode',
  'integrity',
  'invisible',
  'is',
  'ismap',
  'keytype',
  'kind',
  'label',
  'lang',
  'language',
  'latencyhint',
  'leftmargin',
  'link',
  'list',
  'loading',
  'longdesc',
  'loop',
  'low',
  'lowsrc',
  'manifest',
  'marginheight',
  'marginwidth',
  'max',
  'maxlength',
  'mayscript',
  'media',
  'method',
  'min',
  'minlength',
  'multiple',
  'muted',
  'name',
  'nohref',
  'nomodule',
  'nonce',
  'noresize',
  'noshade',
  'novalidate',
  'nowrap',
  'object',
  'open',
  'optimum',
  'part',
  'pattern',
  'ping',
  'placeholder',
  'playsinline',
  'policy',
  'poster',
  'preload',
  'pseudo',
  'readonly',
  'referrerpolicy',
  'rel',
  'reportingorigin',
  'required',
  'resources',
  'rev',
  'reversed',
  'role',
  'rows',
  'rowspan',
  'rules',
  'sandbox',
  'scheme',
  'scope',
  'scopes',
  'scrollamount',
  'scrolldelay',
  'scrolling',
  'select',
  'selected',
  'shadowroot',
  'shadowrootdelegatesfocus',
  'shape',
  'size',
  'sizes',
  'slot',
  'span',
  'spellcheck',
  'src',
  'srcdoc',
  'srclang',
  'srcset',
  'standby',
  'start',
  'step',
  'style',
  'summary',
  'tabindex',
  'target',
  'text',
  'title',
  'topmargin',
  'translate',
  'truespeed',
  'trusttoken',
  'type',
  'usemap',
  'valign',
  'value',
  'valuetype',
  'version',
  'virtualkeyboardpolicy',
  'vlink',
  'vspace',
  'webkitdirectory',
  'width',
  'wrap',
];

const DEFAULT_BLOCKED_ELEMENTS = [
  'script',
  'iframe',
  'object',
  'embed',
  'param',
  'noscript',
  'noframes',
  'noembed',
  'nolayer',
  'base',
  'plaintext',
  'title',
  'textarea',
  'xmp',
  'basefont',
  'template',
  'slot',
  'portal',
  'data',
];

const DEFAULT_DROP_ELEMENTS: string[] = [];

const DEFAULT_DROP_ATTRIBUTES: string[] = [];

class SanitizerConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SanitizerConfigurationError';
  }
}

export class SanitizerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SanitizerError';
  }
}

export class Sanitizer {
  // name of our global object
  public static readonly GLOBALNAME = 'Sanitizer';

  // name of the innerHTML-setter,
  // https://github.com/WICG/sanitizer-api/issues/100
  // when changing this, also change the function declaration below manually.
  public static readonly SETTER_NAME = 'setHTML';

  /**
   * @private
   */
  readonly normalizedConfig: SanitizerConfig;

  constructor(config?: SanitizerConfig) {
    this.normalizedConfig = Sanitizer._normalizeConfig(config);
  }

  public sanitizeFor(localName: string, input: string) {
    // The inactive document does not issue requests and does not execute scripts.
    const inactiveDocument = document.implementation.createHTMLDocument();
    if (!DEFAULT_ALLOWED_ELEMENTS.has(localName)) {
      throw new SanitizerError(`${localName} is not an element in built-in default allow list`);
    }
    const context = inactiveDocument.createElement(localName);
    context.innerHTML = input;
    Sanitizer.sanitizeDocFragment(this.getConfiguration(), context);
    return context;
  }

  /**
   * normalize a supplied Sastrongnitizer-API config, to ensure baseline safety
   * @param {SanitizerConfig} config - a configuration object
   * @returns {obSanitizerConfigject} - a secure config
   * @private
   */
  private static _normalizeConfig(config?: Record<string, any>): SanitizerConfig {
    if ((config && Object.keys(config).length === 0 && config.constructor === Object) || typeof config == 'undefined') {
      return Sanitizer.getDefaultConfiguration();
    }

    let normalizedConfig: SanitizerConfig = {};
    // TODO https://github.com/mozilla/sanitizer-polyfill/issues/29
    // eslint-disable-next-line compat/compat
    for (let [configurationElementList, elements] of Object.entries(config)) {
      if (SUPPORTED_CONFIGURATION_LISTS.has(configurationElementList)) {
        (normalizedConfig as any)[configurationElementList] = elements.map((element: string) => {
          return element.toLowerCase();
        });
        if (configurationElementList === 'allowElements') {
          (normalizedConfig as any)[configurationElementList].forEach((element: string) => {
            if (!DEFAULT_ALLOWED_ELEMENTS.has(element)) {
              throw new SanitizerConfigurationError(`${element} is not included in built-in element allow list`);
            }
          });
        }
      }
    }

    const allowElements =
      // eslint-disable-next-line compat/compat
      normalizedConfig.allowElements || Array.from(DEFAULT_ALLOWED_ELEMENTS);
    const allowAttributes = normalizedConfig.allowAttributes || DEFAULT_ALLOWED_ATTRIBUTES;
    const blockElements = normalizedConfig.blockElements || DEFAULT_BLOCKED_ELEMENTS;
    const dropElements = normalizedConfig.dropElements || DEFAULT_DROP_ELEMENTS;
    const dropAttributes = normalizedConfig.dropAttributes || DEFAULT_DROP_ATTRIBUTES;
    const allowComments = !!normalizedConfig.allowComments;
    const allowCustomElements = !!normalizedConfig.allowCustomElements;
    return {
      allowElements,
      allowAttributes,
      blockElements,
      dropElements,
      dropAttributes,
      allowCustomElements,
      allowComments,
    };
  }

  private static _transformConfig(config: SanitizerConfig): DOMPurify.Config {
    const allowElems = config.allowElements || [];
    const allowAttrs = config.allowAttributes || [];
    const blockElements = config.blockElements || [];
    const dropElements = config.dropElements || [];
    const dropAttrs = config.dropAttributes || [];
    // https://github.com/cure53/DOMPurify/issues/556
    // To drop elements and their children upon sanitization, those elements need to be in both DOMPurify's FORBID_TAGS and FORBID_CONTENTS lists
    const isdropElementsSet = dropElements !== DEFAULT_DROP_ELEMENTS && dropElements.length !== 0;
    const isblockElementsSet = blockElements !== DEFAULT_BLOCKED_ELEMENTS && blockElements.length !== 0;
    let domPurifyConfig: DOMPurify.Config = {
      ALLOWED_TAGS: allowElems,
      ALLOWED_ATTR: allowAttrs as any,
      FORBID_ATTR: dropAttrs as any,
      ALLOW_UNKNOWN_PROTOCOLS: true,
    };
    if (isdropElementsSet && !isblockElementsSet) {
      // Set FORBID_CONTENTS to drop all elements in dropElements
      domPurifyConfig.FORBID_TAGS = dropElements;
      domPurifyConfig.FORBID_CONTENTS = dropElements;
    } else if (isdropElementsSet && isblockElementsSet) {
      // Include all dropElements in FORBID_TAGS and specify to only drop elements in dropElements and not elements in blockElements with FORBID_CONTENTS
      const union = new Set(blockElements.concat(dropElements));
      domPurifyConfig.FORBID_TAGS = Array.from(union);
      domPurifyConfig.FORBID_CONTENTS = dropElements;
    } else {
      domPurifyConfig.FORBID_TAGS = blockElements;
    }
    return domPurifyConfig;
  }

  /**
   * @template T
   * @param {T[]|Set<T>} arrayToModify - array you want to remove items from
   * @param {T[]} itemsToRemove - list of elements or attributes you want to remove from arrayToModify
   * @returns {T[]} - arrayToModify with all items in itemsToRemove removed from it
   */
  private static _removeItems<T>(arrayToModify: T[] | Set<T>, itemsToRemove: T[]): T[] {
    if (arrayToModify instanceof Set) {
      arrayToModify = Array.from(arrayToModify);
    }
    return arrayToModify.filter(element => {
      return !itemsToRemove.includes(element);
    });
  }

  /**
   * sanitize a document fragment in-place
   * @param {SanitizerConfig} config - configuration of the sanitizer object
   * @param {Node} input - a document fragment
   * @return Nothing - the operation is in-place
   * @internal
   */
  public static sanitizeDocFragment(config: SanitizerConfig, input: Node) {
    let domPurifyConfig = Sanitizer._transformConfig(config);
    domPurifyConfig.IN_PLACE = true;
    DOMPurify.sanitize(input, domPurifyConfig);
  }

  /**
   * @returns {SanitizerConfig} the normalized config 
   */
  public getConfiguration(): SanitizerConfig {
    return this.normalizedConfig;
  }

  /**
   * return default sanitizer API configuration defined by the spec - https://wicg.github.io/sanitizer-api/#default-configuration
   * @returns {SanitizerConfig} - default sanitizer API config
   */
  public static getDefaultConfiguration(): SanitizerConfig {
    // https://wicg.github.io/sanitizer-api/#ref-for-default-configuration%E2%91%A5
    return {
      allowCustomElements: false,
      allowElements: Sanitizer._removeItems(DEFAULT_ALLOWED_ELEMENTS, [
        'basefont',
        'command',
        'content',
        'data',
        'image',
        'plaintext',
        'portal',
        'slot',
        'template',
        'textarea',
        'title',
        'xmp',
      ]),
      allowAttributes: Sanitizer._removeItems(DEFAULT_ALLOWED_ATTRIBUTES, ['allowpaymentrequest']),
    };
  }
}

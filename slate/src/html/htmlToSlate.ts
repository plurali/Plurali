import { Node as ParserNode, HTMLElement as ParserHTMLElement, NodeType, parse } from 'node-html-parser';
import { isBrowser } from '../utils/env';
import { htmlTagToSlateMap } from '../utils/htmlTagToSlateMap';

export type EitherNode = Node | ParserNode;

export type EitherElement = Element | ParserHTMLElement;

export type NodeOrHtml = string | EitherNode;

// todo
export type SlateItem = {
    type: string;
    children: SlateItem[];
} | { text: string };

const parseHtml = (html: string): ParserHTMLElement | Document => {
    if (!isBrowser) {
        return parse(html);
    }

    return new DOMParser().parseFromString(html, "text/html");
}

const getChildNodes = (htmlOrEl: NodeOrHtml): (ChildNode | ParserNode)[] => {
    if (typeof htmlOrEl !== "string") {
        return [...htmlOrEl.childNodes];
    }

    const childNodes = parseHtml(htmlOrEl).childNodes;

    return [...childNodes];
}

function isElement(htmlNode): htmlNode is EitherElement {
    return (isBrowser ? htmlNode instanceof Element : htmlNode instanceof ParserHTMLElement)
}

export const htmlToSlateTree = (htmlOrEl: NodeOrHtml): SlateItem[] => {
    return getChildNodes(htmlOrEl).map(htmlNodeToSlateItem).filter(val => !!val) as SlateItem[];
}

export const htmlNodeToSlateItem = (node: EitherNode): SlateItem|null => {
    const nodeType = node.nodeType;

    if (nodeType === NodeType.TEXT_NODE && node.textContent && node.textContent.trim().length) {
        return {
            text: node.textContent
        };
    }

    if (nodeType === NodeType.ELEMENT_NODE && isElement(node)) {
        const tagName = node.tagName.toLowerCase();
        let type = htmlTagToSlateMap[tagName];

        if (!type) {
            // todo
            // console.log(` unrecognized tag <${tagName}>`);
            type = tagName;
        }

        return {
            type, // todo
            children: htmlToSlateTree(node)
        }
    }

    return null;
}
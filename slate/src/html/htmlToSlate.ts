import { Node as ParserNode, HTMLElement as ParserHTMLElement, NodeType, parse } from 'node-html-parser';
import { isBrowser } from '../utils/env';

export type EitherNode = Node | ParserNode;

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

    if (nodeType === NodeType.ELEMENT_NODE) {
        return {
            type: "node", // todo
            children: htmlToSlateTree(node)
        }
    }

    return null;
}
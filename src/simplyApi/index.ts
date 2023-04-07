import { Visibility } from "../system/Visibility";

export interface BaseData {
    key: string
}

export interface BaseEntry<TContent extends object = {}> {
    exists: boolean,
    id: string,
    content: TContent
}

export interface VisibilityAttrs {
    private: boolean,
    preventTrusted: boolean
}

export const parseVisibility = (data: VisibilityAttrs) => data.private 
    ? data.preventTrusted 
        ? Visibility.Private 
        : Visibility.Trusted 
    : Visibility.Public;
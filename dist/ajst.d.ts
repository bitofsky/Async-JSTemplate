declare module "ajst/ns" {
    export namespace Option {
        type url = (id: string, option: Option) => string;
        type ajaxType = 'get' | 'post';
    }
    export interface Option {
        path?: string;
        url?: Option.url | string;
        importJs?: boolean;
        importJsPath?: string;
        importJsUrl?: Option.url | string;
        ajaxType?: Option.ajaxType;
        ajaxCache?: boolean;
        ajaxData?: object;
        autocollect?: boolean;
        override?: object;
        global?: object | any;
        debug?: boolean;
    }
    export interface Compiler {
        (id: string, data?: any, option?: Option, ...globalVariables: any[]): string;
    }
    export interface CacheContainer<T> {
        [index: string]: T;
    }
}
declare module "ajst/lib/CommentStripper" {
    export const CommentStripper: any;
}
declare module "ajst/lib/sprintf" {
    export function sprintf(): any;
}
declare module "ajst/lib/UTIL" {
    export const support: {
        addEventListener: boolean;
        argumentsSlice: boolean;
        cors: boolean;
    };
    export const outputDebugConsole: (logList: any) => void;
    export const UTIL: {
        CommentStripper: any;
        support: {
            addEventListener: boolean;
            argumentsSlice: boolean;
            cors: boolean;
        };
        sprintf: () => any;
        param: (a: any) => string;
        outputDebugConsole: (logList: any) => void;
        each: (o: any, eachFunction: (v: any, key: string | number, o: any) => void) => void;
        toArray: (o: any) => any;
        tag_escape: (s: string) => string;
        tag_unescape: (s: string) => string;
        makeUID: (prefix?: string | undefined) => string;
        randomFromTo: (from: number, to: number) => number;
        isFunction: (o: any) => boolean;
        isArray: (o: any) => boolean;
        isPlainObject: (o: any) => any;
        removeElement: (element: Element) => void;
        extend: (o: {}, ...args: any[]) => {};
        parseHTML: (htmlString: string) => NodeList;
        parseXML: (xmlString: string) => Document;
        ajax: (option: object) => Promise<{}>;
    };
}
declare module "ajst/tplCompiler" {
    import { Option, Compiler } from "ajst/ns";
    export const tplCompiler: (tplString: string, option: Option) => Compiler;
}
declare module "ajst/template" {
    import { Option, Compiler } from "ajst/ns";
    export const getStringFromURL: (url: string, getAjax: () => Promise<string>) => Promise<string>;
    export const getTemplate: (id: string) => string;
    export const flushCaches: () => void;
    export const setTemplate: (id: string, tplString: string) => void;
    export const setImportJs: (id: string, importJs: string) => void;
    export const getCompiler: (id: string, option?: Option) => Compiler;
    export const setTemplateElement: (element: Element) => boolean;
}
declare module "ajst/option" {
    import { Option } from "ajst/ns";
    export const DEFAULT_OPTION: Option;
    export const CONST_OPTION: Option;
    export const option: (newOption?: Option | undefined) => boolean | Option;
}
declare module "ajst/prepare" {
    import { Option, Compiler } from "ajst/ns";
    export const prepare: (id: string, option?: Option) => Promise<Compiler>;
}
declare module "ajst/core" {
    import { Option } from "ajst/ns";
    export const get: (id: string, data?: any, option?: Option | undefined) => Promise<string>;
    export const ajax: (id: string, url: string, option?: Option | undefined) => Promise<string>;
    export const each: (id: string, data: Iterable<any>, option?: Option | undefined) => Promise<string>;
    export const noConflict: () => any;
}
declare module "ajst/autocollect" {
    export const autocollect: () => void;
}
declare module "ajst" {
    export * from "ajst/autocollect";
    export * from "ajst/core";
    export * from "ajst/option";
    export * from "ajst/prepare";
    export * from "ajst/template";
    export * from "ajst/tplCompiler";
    export * from "ajst/ns";
}

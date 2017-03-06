declare module "src/ns" {
    export namespace Option {
        type url = (id: string, option: Option) => string;
        type ajaxType = 'get' | 'post';
    }
    export interface Option {
        path?: string;
        url?: Option.url | string;
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
declare module "src/lib/CommentStripper" {
    export const CommentStripper: any;
}
declare module "src/lib/sprintf" {
    export function sprintf(): any;
}
declare module "src/lib/UTIL" {
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
        each: (o: any, eachFunction: any) => void;
        toArray: (o: any) => any;
        tag_escape: (s: any) => any;
        tag_unescape: (s: any) => any;
        makeUID: (prefix: any) => any;
        randomFromTo: (from: any, to: any) => number;
        isFunction: (o: any) => boolean;
        isArray: (o: any) => boolean;
        isPlainObject: (o: any) => any;
        removeElement: (element: any) => void;
        extend: (o: any, ...args: any[]) => any;
        parseHTML: (htmlString: any) => NodeList;
        parseXML: (xmlString: any) => Document;
        ajax: (option: any) => Promise<{}>;
    };
}
declare module "src/tplCompiler" {
    import { Option, Compiler } from "src/ns";
    export const tplCompiler: (tplString: string, option: Option) => Compiler;
}
declare module "src/template" {
    import { Option, Compiler } from "src/ns";
    export const getTemplateFromURL: (id: string, getAjax: () => Promise<string>) => Promise<string>;
    export const getTemplate: (id: string) => string;
    export const setTemplate: (id: string, tplString: string) => void;
    export const getCompiler: (id: string, option?: Option) => Compiler;
    export const setTemplateElement: (element: Element) => boolean;
}
declare module "src/option" {
    import { Option } from "src/ns";
    export const DEFAULT_OPTION: Option;
    export const CONST_OPTION: Option;
    export const option: (newOption?: Option) => boolean | Option;
}
declare module "src/prepare" {
    import { Option, Compiler } from "src/ns";
    export const prepare: (id: string, option?: Option) => Promise<Compiler>;
}
declare module "src/core" {
    import { Option } from "src/ns";
    export const get: (id: string, data?: any, option?: Option) => Promise<string>;
    export const ajax: (id: string, url: string, option?: Option) => Promise<string>;
    export const each: (id: string, data: any, option?: Option) => Promise<string>;
    export const noConflict: () => any;
}
declare module "src/autocollect" {
    export const autocollect: () => void;
}
declare module "ajst" {
    export * from "src/autocollect";
    export * from "src/core";
    export * from "src/option";
    export * from "src/prepare";
    export * from "src/template";
    export * from "src/tplCompiler";
    export * from "src/ns";
}

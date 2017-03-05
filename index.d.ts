declare module "src/ns" {
    export namespace ns {
        type HTTPMethod = 'get' | 'post';
        interface AJSTCompiler {
            (id: string, data?: any, option?: AJSTOption, ...globalVariables: any[]): string;
        }
        interface AJSTOption {
            path?: string;
            url?: () => string;
            ajaxType?: HTTPMethod;
            ajaxCache?: boolean;
            ajaxData?: object;
            autocollect?: boolean;
            override?: object;
            global?: object | any;
            debug?: boolean;
        }
        interface AJSTCacheContainer<T> {
            [index: string]: T;
        }
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
    import { ns } from "src/ns";
    export const tplCompiler: (tplString: string, option: any) => ns.AJSTCompiler;
}
declare module "src/template" {
    import { ns } from "src/ns";
    export const getTemplateFromURL: (id: string, getAjax: () => Promise<string>) => Promise<string>;
    export const getTemplate: (id: string) => string;
    export const setTemplate: (id: string, tplString: string) => void;
    export const getCompiler: (id: string, option: ns.AJSTOption) => ns.AJSTCompiler;
    export const setTemplateElement: (element: any) => boolean;
}
declare module "src/option" {
    import { ns } from "src/ns";
    export const DEFAULT_OPTION: ns.AJSTOption;
    export const CONST_OPTION: ns.AJSTOption;
    export const option: (newOption?: ns.AJSTOption) => boolean | ns.AJSTOption;
}
declare module "src/prepare" {
    import { ns } from "src/ns";
    export const prepare: (id: string, option?: ns.AJSTOption) => Promise<ns.AJSTCompiler>;
}
declare module "src/core" {
    import { ns } from "src/ns";
    export const get: (id: string, data?: any, option?: ns.AJSTOption) => Promise<string>;
    export const ajax: (id: string, url: string, option: ns.AJSTOption) => Promise<string>;
    export const each: (id: string, data: any, option: ns.AJSTOption) => Promise<string>;
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

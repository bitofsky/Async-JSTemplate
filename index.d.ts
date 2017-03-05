/// <reference path="src/core.d.ts" />
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
        uglyInnerHTML: boolean;
        cors: boolean;
    };
    export const outputDebugConsole: (logList: any) => void;
    export const UTIL: {
        CommentStripper: any;
        support: {
            addEventListener: boolean;
            argumentsSlice: boolean;
            uglyInnerHTML: boolean;
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
    export const tplCompiler: (str: string, option: any) => AJST.AJSTCompiler;
}
declare module "src/template" {
    export const getTemplateFromURL: (id: string, getAjax: () => Promise<any>) => Promise<any>;
    export const getTemplate: (id: string) => string;
    export const setTemplate: (id: string, tplString: string) => void;
    export const getCompiler: (id: string, option: AJST.AJSTOption) => AJST.AJSTCompiler;
    export const setTemplateElement: (element: any) => boolean;
}
declare module "src/option" {
    import AJST from "src/core";
    export const DEFAULT_OPTION: AJST.AJSTOption;
    export const CONST_OPTION: AJST.AJSTOption;
    export const option: (newOption?: any) => any;
}
declare module "src/prepare" {
    export const prepare: (id: string, option?: AJST.AJSTOption) => Promise<AJST.AJSTCompiler>;
}
declare module "src/core" {
    export const AJST: (id: string, data?: any, option?: AJST.AJSTOption) => Promise<string>;
    export const ajax: (id: string, url: string, option: AJST.AJSTOption) => Promise<string>;
    export const each: (id: string, data: any, option: AJST.AJSTOption) => Promise<string>;
    export const noConflict: () => any;
}
declare module "src/autocollect" {
    export const autocollect: () => void;
}
declare module "ajst" {
    import { AJST } from "src/core";
    export default AJST;
    export * from "src/autocollect";
    export * from "src/core";
    export * from "src/option";
    export * from "src/prepare";
    export * from "src/template";
    export * from "src/tplCompiler";
}

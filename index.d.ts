/// <reference path="src/index.d.ts" />

declare module "lib/CommentStripper" {
    export const CommentStripper: any;
}
declare module "lib/sprintf" {
    export function sprintf(): any;
}
declare module "lib/UTIL" {
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
declare module "ajst" {
    let AJST: AJST.AJST;
    export default AJST;
}

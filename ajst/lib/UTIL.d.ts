export declare const support: {
    addEventListener: boolean;
    argumentsSlice: boolean;
    cors: boolean;
};
export declare const outputDebugConsole: (logList: any) => void;
export declare const UTIL: {
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

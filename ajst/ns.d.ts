export declare namespace Option {
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

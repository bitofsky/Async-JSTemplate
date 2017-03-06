/**
 * Option namespace
 */
export declare namespace Option {
    type url = (id: string, option: Option) => string;
    type ajaxType = 'get' | 'post';
}

/**
 * Option
 */
export interface Option {

    /**
     * TPL File URL
     */
    path?: string;

    /**
     * TPL File URL generator
     */
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
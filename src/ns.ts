export namespace ns {

    export interface AJSTCompiler {
        (id: string, data?: any, option?: AJSTOption, ...globalVariables: any[]): string;
    }

    export type AJSTOptionUrlGetter = (id: string, option: AJSTOption) => string;
    export type AJSTOptionHTTPMethod = 'get' | 'post';

    export interface AJSTOption {

        /**
         * TPL File URL
         */
        path?: string;

        /**
         * TPL File URL generator
         */
        url?: AJSTOptionUrlGetter | string;

        ajaxType?: AJSTOptionHTTPMethod;
        ajaxCache?: boolean;
        ajaxData?: object;
        autocollect?: boolean;
        override?: object;
        global?: object | any;
        debug?: boolean;

    }

    export interface AJSTCacheContainer<T> {
        [index: string]: T;
    }

}

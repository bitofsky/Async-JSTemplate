export namespace ns {

    export interface AJSTCompiler {
        (id: string, data?: any, option?: AJSTOption, ...globalVariables: any[]): string;
    }

    export interface AJSTOption {

        /**
         * TPL File URL
         */
        path?: string;

        /**
         * TPL File URL generator
         */
        url?: () => string;

        ajaxType?: string;
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

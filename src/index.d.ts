declare namespace AJST {

    interface AJSTCompiler {
        (id: string, data?: any, option?: AJSTOption, ...globalVariables: any[]): string;
    }

    interface AJSTOption {

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

    interface AJSTCacheContainer<T> {
        [index: string]: T;
    }

}

declare var XDomainRequest: any;
declare var ActiveXObject: any;

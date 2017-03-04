declare namespace AJST {

    interface AJST {

        /**
         * Generate AJST Template String
         */
        (id: string, data?: any, option?: AJSTOption): Promise<string>;

        /**
         * Preparing Template
         */
        prepare(id: string, option?: AJSTOption): Promise<AJSTCompiler>;

        /**
         * Get Template
         */
        getTemplate(id: string): string;

        /**
         * Create/Replace Template
         */
        setTemplate(id: string, tplString: string): void;

        /**
         * Set template element
         */
        setTemplateElement(element: HTMLElement): boolean;

        /**
         * Get Template Compiler
         */
        getCompiler(id: string, option?: AJSTOption): AJSTCompiler;

        /**
         * return old AJST
         */
        noConflict(): any;

        /**
         * get/set Default Option
         * @example
         * var opt = AJST.option();                 // get Default
         * AJST.option({path: '/template/$id.tpl'}) // set option.path
         * AJST.option({util:{                      // set option.util.add
         *   add: function(a, b){ return +a + +b; }
         * }});
         */
        option(newOption?: AJSTOption): AJSTOption | boolean;

        /**
         * Remote JSON Data
         */
        ajax(id: string, url: string, option?: AJSTOption): Promise<string>;

        /**
         * AJST for iterable data (array or promise)
         */
        each(id: string, data?: any, option?: AJSTOption): Promise<string>;

        /**
         * start Template auto collect
         */
        autocollect(): void;

    }

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
        global?: object;
        debug?: boolean;

    }

    interface AJSTCompilerContainer {
        [index: string]: AJSTCompiler;
    }

    interface AJSTTemplateContainer {
        [index: string]: string;
    }

    interface AJSTAjaxContainer {
        [index: string]: any;
    }

}

declare var XDomainRequest: any;
declare var ActiveXObject: any;

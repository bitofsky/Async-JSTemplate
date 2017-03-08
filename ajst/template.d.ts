import { Option, Compiler } from './ns';
export declare const getTemplateFromURL: (id: string, getAjax: () => Promise<string>) => Promise<string>;
export declare const getTemplate: (id: string) => string;
export declare const flushCaches: () => void;
export declare const setTemplate: (id: string, tplString: string) => void;
export declare const getCompiler: (id: string, option?: Option) => Compiler;
export declare const setTemplateElement: (element: Element) => boolean;

import { Option, Compiler, CacheContainer } from './ns';
import { tplCompiler } from './tplCompiler';
import { CommentStripper } from './lib/CommentStripper';

/**
 * Template String Cache
 */
let tplCache: CacheContainer<string> = {};

/**
 * Import JS Cache
 */
let importJsCache: CacheContainer<string> = {};

/**
 * Ajax URL Cache
 */
let ajaxCache: CacheContainer<Promise<string>> = {};

/**
 * Template Compiler Cache
 */
let compileCache: CacheContainer<Compiler> = {};

/**
 * Get Template / ImportJS from URL
 */
export const getStringFromURL = (url: string, getAjax: () => Promise<string>) =>
    ajaxCache[url] = ajaxCache[url] || getAjax();

/**
 * Get Template
 */
export const getTemplate = (id: string) => tplCache[id];

/** 
 * Remove all caches
 */
export const flushCaches = () => {
    tplCache = {};
    ajaxCache = {};
    compileCache = {};
    importJsCache = {};
};

/**
 * Create/Replace Template
 */
export const setTemplate = (id: string, tplString: string) => {

    const trimed = CommentStripper.strip(tplString.trim());

    tplCache[id] = id.match(/\.js$/) ? `<? ${trimed} ?>` : trimed;

    if (importJsCache[id])
        tplCache[id] += `<? ${importJsCache[id]} ?>`;

    delete compileCache[id];

};

export const setImportJs = (id: string, importJs: string) => {
    const trimed = CommentStripper.strip(importJs.trim());
    importJsCache[id] = importJs;
};

/**
 * Get Template Compiler
 */
export const getCompiler = (id: string, option: Option = {}) =>
    compileCache[id] = compileCache[id] || tplCompiler(getTemplate(id), option);

/**
 * Set template element
 */
export const setTemplateElement = (element: Element) => {

    if (!element.id || element.tagName !== 'SCRIPT') return false;

    setTemplate(element.id, element.innerHTML/*.replace(/<!--\?/g, '<?').replace(/\?-->/g, '?>')*/);

    return true;

};

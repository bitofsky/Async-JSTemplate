import { Option, Compiler, CacheContainer } from './ns';
import { tplCompiler } from './tplCompiler';
import { CommentStripper } from './lib/CommentStripper';

/**
 * Template String Cache
 */
const tplCache: CacheContainer<string> = {};

/**
 * Ajax URL Cache
 */
const ajaxCache: CacheContainer<Promise<string>> = {};

/**
 * Template Compiler Cache
 */
const compileCache: CacheContainer<Compiler> = {};

/**
 * Get Template from URL
 */
export const getTemplateFromURL = (id: string, getAjax: () => Promise<string>) =>
    ajaxCache[id] = ajaxCache[id] || getAjax();

/**
 * Get Template
 */
export const getTemplate = (id: string) => tplCache[id];

/**
 * Create/Replace Template
 */
export const setTemplate = (id: string, tplString: string) => {

    const trimed = CommentStripper.strip(tplString.trim());

    tplCache[id] = id.match(/\.js$/) ? `<? ${trimed} ?>` : trimed;
    delete compileCache[id];

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

    setTemplate(element.id, element.innerHTML.replace(/<!--\?/g, '<?').replace(/\?-->/g, '?>'));

    return true;

};

import { ns } from './ns';
import { tplCompiler } from './tplCompiler';
import { CommentStripper } from './lib/CommentStripper';

/**
 * Template String Cache
 */
const tplCache: ns.AJSTCacheContainer<string> = {};

/**
 * Ajax URL Cache
 */
const ajaxCache: ns.AJSTCacheContainer<Promise<any>> = {};

/**
 * Template Compiler Cache
 */
const compileCache: ns.AJSTCacheContainer<ns.AJSTCompiler> = {};

/**
 * Get Template from URL
 */
export const getTemplateFromURL = (id: string, getAjax: () => Promise<any>) =>
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
    compileCache[id] = null;

}

/**
 * Get Template Compiler
 */
export const getCompiler = (id: string, option: ns.AJSTOption) =>
    compileCache[id] = compileCache[id] || tplCompiler(getTemplate(id), option);

/**
 * Set template element
 */
export const setTemplateElement = function (element) {

    if (!element.id || element.tagName !== 'SCRIPT') return false;

    setTemplate(element.id, element.innerHTML.replace(/<!--\?/g, '<?').replace(/\?-->/g, '?>'));

    return true;

};

import { tplCompiler } from './tplCompiler';
import { CommentStripper } from './lib/CommentStripper';

/**
 * Template String Cache
 */
const tplCache: AJST.AJSTCacheContainer<string> = {};

/**
 * Ajax URL Cache
 */
const ajaxCache: AJST.AJSTCacheContainer<Promise<any>> = {};

/**
 * Template Compiler Cache
 */ 
const compileCache: AJST.AJSTCacheContainer<AJST.AJSTCompiler> = {};

/**
 * Get Template from URL
 */
export const getTemplateFromURL = (id: string, getAjax: () => Promise<any>) => {
    if (ajaxCache[id]) return ajaxCache[id];
    else ajaxCache[id] = getAjax();
};

/**
 * Get Template
 */
export const getTemplate = (id: string) => tplCache[id];

/**
 * Create/Replace Template
 */
export const setTemplate = (id: string, tplString: string) => {
    tplCache[id] = CommentStripper.strip(tplString.trim());
    compileCache[id] = null;

    if (id.match(/\.js$/))
        tplCache[id] = `<? ${tplCache[id]} ?>`;
}

/**
 * Get Template Compiler
 */
export const getCompiler = (id: string, option: AJST.AJSTOption) => {

    if (!compileCache[id]) {
        const tplString = getTemplate(id);
        if (tplString === undefined)
            throw new Error('AJST Undefined TPL ID (ID: ' + id + ')');
        compileCache[id] = tplCompiler(tplString, option);
    }

    return compileCache[id];

}

/**
 * Set template element
 */
export const setTemplateElement = function (element) {
    if (!element.id || element.tagName !== 'SCRIPT')
        return false;
    setTemplate(element.id, element.innerHTML.replace(/<!--\?/g, '<?').replace(/\?-->/g, '?>'));
    return true;
};

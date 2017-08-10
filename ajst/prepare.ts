import { Option, Compiler } from './ns';
import { getStringFromURL, getTemplate, setTemplateElement, setTemplate, setImportJs, getCompiler } from './template';
import { UTIL } from './lib/UTIL';
import { DEFAULT_OPTION } from './option';

/**
 * Preparing Template
 */
export const prepare = async (id: string, option: Option = {}): Promise<Compiler> => {

    const opt: Option = UTIL.extend({}, DEFAULT_OPTION, option);

    let url = (typeof opt.url === 'function' ? opt.url(id, option) : opt.url) || id;
    url = url.replace(/\$id/g, id);

    let importJsUrl = (typeof opt.importJsUrl === 'function' ? opt.importJsUrl(id, option) : opt.importJsUrl) || id;
    importJsUrl = importJsUrl.replace(/\$id/g, id);

    if (getTemplate(id)) // aready have..
        return getCompiler(id, opt);

    const fromURL = () => <Promise<string>>UTIL.ajax({
        type: opt.ajaxType,
        cache: opt.ajaxCache,
        data: opt.ajaxData,
        url: url,
        dataType: 'text'
    }).catch(e => {
        throw new Error(`AJST prepare failed : file not found (ID: ${id}, URL: ${url})`);
    });

    const importJsFromURL = () => <Promise<string>>UTIL.ajax({
        type: 'get',
        cache: opt.ajaxCache,
        data: opt.ajaxData,
        url: importJsUrl,
        dataType: 'text'
    });

    const [strTemplate, strImportJs] = await Promise.all([
        getStringFromURL(url, fromURL), // Template file load from URL
        opt.importJs ? getStringFromURL(importJsUrl, importJsFromURL) : '' // Import JS load from URL
    ]);

    const allTemplate = UTIL.parseHTML(strTemplate);
    const newElements: Element[] = [];

    try { // compile error handling

        strImportJs && setImportJs(id, strImportJs);

        Array.prototype.forEach.call(allTemplate, (element: Element, idx: number) => {
            // check opt.override id set
            if (idx === 0 || !(opt.override || {})[element.id]) newElements.push(element);
        });

        if (!newElements.filter(setTemplateElement).length) // if just text nodes
            setTemplate(id, strTemplate); // set response string

        return getCompiler(id, opt);

    } catch (e) {
        e.message = `AJST Prepare failed : compile (ID: ${id}, URL: ${url})\n${e.message}`;
        throw e;
    }
};

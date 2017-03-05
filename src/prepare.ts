// Preparing Template
import { ns } from './ns';
import { getTemplateFromURL, getTemplate, setTemplateElement, setTemplate, getCompiler } from './template';
import { UTIL } from './lib/UTIL';
import { DEFAULT_OPTION } from './option';

export const prepare = async (id: string, option: ns.AJSTOption = {}) => {

    const opt: ns.AJSTOption = UTIL.extend({}, DEFAULT_OPTION, option);

    let url = typeof opt.url === 'function' ? opt.url(id, option) : opt.url;
    url = url || opt.path.replace(/\$id/g, id);

    if (getTemplate(id)) // aready have..
        return getCompiler(id, opt);

    const fromURL = () => UTIL.ajax({
        type: opt.ajaxType,
        cache: opt.ajaxCache,
        data: opt.ajaxData,
        url: url,
        dataType: 'text'
    }).catch(e => {
        throw new Error(`AJST prepare failed : file not found (ID: ${id}, URL: ${url})`);
    });

    const strTemplate = await getTemplateFromURL(url, fromURL); // Template file load from URL
    const allTemplate = UTIL.parseHTML(strTemplate);
    const newElements = [];

    try { // compile error handling

        Array.prototype.forEach.call(allTemplate, function (element, idx) {
            // check opt.override id set
            if (idx === 0 || !opt.override[element.id]) newElements.push(element);
        });

        if (!newElements.filter(setTemplateElement).length) // if just text nodes
            setTemplate(id, strTemplate); // set response string

        return getCompiler(id, opt);

    } catch (e) {
        e.message = `AJST Prepare failed : compile (ID: ${id}, URL: ${url})\n${e.message}`;
        throw e;
    }
};

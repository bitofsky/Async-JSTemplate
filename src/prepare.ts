// Preparing Template
import { ns } from '../namespace';
import { getTemplateFromURL, getTemplate, setTemplateElement, setTemplate, getCompiler } from './template';
import { UTIL } from './lib/UTIL';
import { DEFAULT_OPTION } from './option';

export const prepare = async (id: string, option: ns.AJSTOption = {}) => {

    const opt = UTIL.extend({}, DEFAULT_OPTION, option);

    let url = opt.url || opt.path.replace(/\$id/g, id);

    if (typeof url === 'function')
        url = url(id, option) || opt.path.replace(/\$id/g, id);

    if (getTemplate(id)) // aready have..
        return getCompiler(id, opt);

    const fromURL = () => UTIL.ajax({
        type: opt.ajaxType,
        cache: opt.ajaxCache,
        data: opt.ajaxData,
        url: url,
        dataType: 'html'
    }).catch(e => {
        throw new Error(`AJST prepare failed : file not found (ID: ${id}, URL: ${url})`);
    });

    const allTemplate = <NodeList>await getTemplateFromURL(url, fromURL); // Template file load from URL
    const newElements = [];

    try { // compile error handling

        Array.prototype.forEach.call(allTemplate, function (element, idx) {
            // check opt.override id set
            if (idx === 0 || !opt.override[element.id]) newElements.push(element);
        });

        newElements.filter(setTemplateElement);

        return getCompiler(id, opt);

    } catch (e) {
        e.message = `AJST Prepare failed : compile (ID: ${id}, URL: ${url})\n${e.message}`;
        throw e;
    }
};

// Preparing Template
import { getTemplateFromURL, getTemplate, setTemplateElement, setTemplate, getCompiler } from './template';
import { UTIL } from './lib/UTIL';
import { DEFAULT_OPTION } from './option';

export const prepare = async (id: string, option: AJST.AJSTOption = {}) => {

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
        new Error('AJST file not found : (ID: ' + id + ', URL: ' + url + ')');
    });

    const arrTemplate = await getTemplateFromURL(url, fromURL);
    const arr = [];
    let cnt = 0;

    Array.prototype.forEach.call(arrTemplate, function (element, idx) {
        // check opt.override id set
        if (idx === 0 || !opt.override[element.id]) arr.push(element);
    });

    if (!arr.filter(setTemplateElement).length)
        setTemplate(id, arrTemplate.htmlString);
};

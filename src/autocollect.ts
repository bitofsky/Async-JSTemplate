import { get, ajax } from './core';
import { DEFAULT_OPTION } from './option';
import { UTIL, support } from './lib/UTIL';
import { setTemplateElement } from './template';

/**
 * Template auto collect
 */
export const autocollect = () => {

    if (!DEFAULT_OPTION.autocollect) return;

    Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), setTemplateElement);

    Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), resolveElement);

};

const resolveElement = async element => {

    // auto replace
    if (!element.getAttribute('data-ajst'))
        return UTIL.removeElement(element);

    const ajaxURL = element.getAttribute('data-ajst-ajax');
    const data = element.getAttribute('data-ajst-data') ? JSON.parse(element.getAttribute('data-ajst-data')) : undefined;
    const option = element.getAttribute('data-ajst-option') ? JSON.parse(element.getAttribute('data-ajst-option')) : undefined;
    const tplOutput = await (ajaxURL ? ajax(element.id, ajaxURL, option) : get(element.id, data, option));
    const tplElementList = UTIL.parseHTML(tplOutput);

    UTIL.toArray(tplElementList).forEach(function (tplElement) {
        element.parentNode.insertBefore(tplElement, element);
    });

    UTIL.removeElement(element);

};

// window event bind for autocollect
if (support.addEventListener)
    document.addEventListener('DOMContentLoaded', autocollect, false);
else
    document['attachEvent']('onreadystatechange', autocollect);

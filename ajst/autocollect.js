"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("./core");
const option_1 = require("./option");
const UTIL_1 = require("./lib/UTIL");
const template_1 = require("./template");
exports.autocollect = () => {
    if (!option_1.DEFAULT_OPTION.autocollect)
        return;
    Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), template_1.setTemplateElement);
    Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), resolveElement);
};
const resolveElement = (element) => __awaiter(this, void 0, void 0, function* () {
    if (!element.getAttribute('data-ajst'))
        return UTIL_1.UTIL.removeElement(element);
    const ajaxURL = element.getAttribute('data-ajst-ajax');
    const data = element.getAttribute('data-ajst-data') ? JSON.parse(element.getAttribute('data-ajst-data') || '') : undefined;
    const option = element.getAttribute('data-ajst-option') ? JSON.parse(element.getAttribute('data-ajst-option') || '') : undefined;
    const tplOutput = yield (ajaxURL ? core_1.ajax(element.id, ajaxURL, option) : core_1.get(element.id, data, option));
    const tplElementList = UTIL_1.UTIL.parseHTML(tplOutput);
    UTIL_1.UTIL.toArray(tplElementList).forEach(function (tplElement) {
        element.parentNode && element.parentNode.insertBefore(tplElement, element);
    });
    UTIL_1.UTIL.removeElement(element);
});
if (UTIL_1.support.addEventListener)
    document.addEventListener('DOMContentLoaded', exports.autocollect, false);
else
    document['attachEvent']('onreadystatechange', exports.autocollect);
//# sourceMappingURL=autocollect.js.map
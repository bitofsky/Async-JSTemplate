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
const template_1 = require("./template");
const UTIL_1 = require("./lib/UTIL");
const option_1 = require("./option");
exports.prepare = (id, option = {}) => __awaiter(this, void 0, void 0, function* () {
    const opt = UTIL_1.UTIL.extend({}, option_1.DEFAULT_OPTION, option);
    let url = typeof opt.url === 'function' ? opt.url(id, option) : opt.url;
    url = url || (opt.path || '').replace(/\$id/g, id);
    if (template_1.getTemplate(id))
        return template_1.getCompiler(id, opt);
    const fromURL = () => UTIL_1.UTIL.ajax({
        type: opt.ajaxType,
        cache: opt.ajaxCache,
        data: opt.ajaxData,
        url: url,
        dataType: 'text'
    }).catch(e => {
        throw new Error(`AJST prepare failed : file not found (ID: ${id}, URL: ${url})`);
    });
    const strTemplate = yield template_1.getTemplateFromURL(url, fromURL);
    const allTemplate = UTIL_1.UTIL.parseHTML(strTemplate);
    const newElements = [];
    try {
        Array.prototype.forEach.call(allTemplate, (element, idx) => {
            if (idx === 0 || !(opt.override || {})[element.id])
                newElements.push(element);
        });
        if (!newElements.filter(template_1.setTemplateElement).length)
            template_1.setTemplate(id, strTemplate);
        return template_1.getCompiler(id, opt);
    }
    catch (e) {
        e.message = `AJST Prepare failed : compile (ID: ${id}, URL: ${url})\n${e.message}`;
        throw e;
    }
});
//# sourceMappingURL=prepare.js.map
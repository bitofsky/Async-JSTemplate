"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tplCompiler_1 = require("./tplCompiler");
const CommentStripper_1 = require("./lib/CommentStripper");
let tplCache = {};
let importJsCache = {};
let ajaxCache = {};
let compileCache = {};
exports.getStringFromURL = (url, getAjax) => ajaxCache[url] = ajaxCache[url] || getAjax();
exports.getTemplate = (id) => tplCache[id];
exports.flushCaches = () => {
    tplCache = {};
    ajaxCache = {};
    compileCache = {};
    importJsCache = {};
};
exports.setTemplate = (id, tplString) => {
    const trimed = CommentStripper_1.CommentStripper.strip(tplString.trim());
    tplCache[id] = id.match(/\.js$/) ? `<? ${trimed} ?>` : trimed;
    if (importJsCache[id])
        tplCache[id] += `<? ${importJsCache[id]} ?>`;
    delete compileCache[id];
};
exports.setImportJs = (id, importJs) => {
    importJsCache[id] = importJs;
};
exports.getCompiler = (id, option = {}) => compileCache[id] = compileCache[id] || tplCompiler_1.tplCompiler(exports.getTemplate(id), option);
exports.setTemplateElement = (element) => {
    if (!element.id || element.tagName !== 'SCRIPT')
        return false;
    exports.setTemplate(element.id, element.innerHTML);
    return true;
};
//# sourceMappingURL=template.js.map
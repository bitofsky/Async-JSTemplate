"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tplCompiler_1 = require("./tplCompiler");
const CommentStripper_1 = require("./lib/CommentStripper");
let tplCache = {};
let ajaxCache = {};
let compileCache = {};
exports.getTemplateFromURL = (id, getAjax) => ajaxCache[id] = ajaxCache[id] || getAjax();
exports.getTemplate = (id) => tplCache[id];
exports.flushCaches = () => {
    tplCache = {};
    ajaxCache = {};
    compileCache = {};
};
exports.setTemplate = (id, tplString) => {
    const trimed = CommentStripper_1.CommentStripper.strip(tplString.trim());
    tplCache[id] = id.match(/\.js$/) ? `<? ${trimed} ?>` : trimed;
    delete compileCache[id];
};
exports.getCompiler = (id, option = {}) => compileCache[id] = compileCache[id] || tplCompiler_1.tplCompiler(exports.getTemplate(id), option);
exports.setTemplateElement = (element) => {
    if (!element.id || element.tagName !== 'SCRIPT')
        return false;
    exports.setTemplate(element.id, element.innerHTML.replace(/<!--\?/g, '<?').replace(/\?-->/g, '?>'));
    return true;
};
//# sourceMappingURL=template.js.map
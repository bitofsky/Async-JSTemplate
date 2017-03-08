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
const UTIL_1 = require("./lib/UTIL");
const prepare_1 = require("./prepare");
const option_1 = require("./option");
const { outputDebugConsole } = UTIL_1.UTIL;
exports.get = (id, data, option) => __awaiter(this, void 0, void 0, function* () {
    try {
        option = option || {};
        const curLogs = [];
        const parentLogs = option['_log'] || [];
        const opt = UTIL_1.UTIL.extend({}, option_1.DEFAULT_OPTION, option);
        curLogs['id'] = id;
        curLogs['now'] = new Date();
        curLogs['isRoot'] = !opt.global.$parent;
        const outputDebug = !!(curLogs['isRoot'] && opt.debug);
        parentLogs.push(curLogs);
        opt['_log'] = curLogs;
        const pData = Promise.resolve(typeof data === 'function' ? data() : data).then(result => {
            curLogs.push(['time', 'elapsed time - data', new Date()]);
            curLogs.push(['log', 'data', result]);
            return result;
        });
        const pCompiler = prepare_1.prepare(id, opt).then(result => {
            curLogs.push(['time', 'elapsed time - tpl prepare', new Date()]);
            return result;
        });
        const solvedData = yield pData;
        const compiler = yield pCompiler;
        const output = compiler(id, solvedData, opt, ...Object.keys(opt.global).map(k => opt.global[k]));
        curLogs.push(['time', 'elapsed time - compile success', new Date()]);
        outputDebug && outputDebugConsole(curLogs);
        return output;
    }
    catch (e) {
        e.message = `AJST error (ID: ${id})\n${e.message}`;
        throw e;
    }
});
exports.ajax = (id, url, option) => exports.get(id, UTIL_1.UTIL.ajax({
    url,
    dataType: 'json'
}), option);
exports.each = function (id, data, option) {
    return __awaiter(this, void 0, void 0, function* () {
        const list = yield data;
        const dataPromise = [];
        UTIL_1.UTIL.each(list, (v) => dataPromise.push(exports.get(id, v, option)));
        if (!dataPromise.length)
            return '';
        return (yield Promise.all(dataPromise)).join('');
    });
};
exports.noConflict = () => window['AJST'] = _oldAJST;
const _oldAJST = window['AJST'];
option_1.CONST_OPTION.global = {};
option_1.CONST_OPTION.global.AJSTget = exports.get;
option_1.CONST_OPTION.global.AJSTajax = exports.ajax;
option_1.CONST_OPTION.global.AJSTeach = exports.each;
option_1.CONST_OPTION.global.util = UTIL_1.UTIL;
UTIL_1.UTIL.extend(option_1.DEFAULT_OPTION, option_1.CONST_OPTION);
//# sourceMappingURL=core.js.map
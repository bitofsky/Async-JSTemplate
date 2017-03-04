/**
 * AJST : Asynchronous JavaScript Templating
 *   for Web Browsers
 *
 * Demo : http://bitofsky.github.io/Async-JSTemplate
 * Source : https://github.com/bitofsky/Async-JSTemplate
 *
 * Inspired by
 *   John Resig's JavaScript Micro-Templating: http://ejohn.org/blog/javascript-micro-templating/
 *   blueimp's JavaScript-Templates: https://github.com/blueimp/JavaScript-Templates/
 *
 * The MIT License
 * Copyright (C) 2013 Bum-seok Hwang (bitofsky@naver.com)
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @author bitofsky@naver.com 2013.07.25
 * @encoding UTF-8
 * @version 1.5
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "../lib/util.js"], function (require, exports, util_js_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var global = window;
    var support = util_js_1.default.support;
    var CommentStripper = util_js_1.default.CommentStripper, outputDebugConsole = util_js_1.default.outputDebugConsole;
    var _oldAJST = global['AJST'];
    var DEFAULT_OPTION;
    var CONST_OPTION;
    // Template String Cache
    var tplCache = {};
    // Ajax URL Cache
    var ajaxCache = {};
    // Template Compiler Cache
    var compileCache = {};
    // Template Process
    var AJST;
    AJST = function (id, data, option) {
        if (data === void 0) { data = undefined; }
        if (option === void 0) { option = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var curLogs_1, parentLogs, opt, outputDebug, pData, pCompiler, compiler, output, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        option = option || {};
                        curLogs_1 = [];
                        parentLogs = option['_log'] || [];
                        opt = util_js_1.default.extend({}, DEFAULT_OPTION, option);
                        curLogs_1['id'] = id;
                        curLogs_1['now'] = new Date();
                        curLogs_1['isRoot'] = !opt.global.$parent;
                        outputDebug = !!(curLogs_1['isRoot'] && opt.debug);
                        parentLogs.push(curLogs_1);
                        opt._log = curLogs_1;
                        pData = Promise.resolve(typeof data === 'function' ? data() : data).then(function (result) {
                            curLogs_1.push(['time', 'elapsed time - data', new Date()]);
                            curLogs_1.push(['log', 'data', result]);
                            return result;
                        });
                        pCompiler = AJST.prepare(id, opt).then(function (result) {
                            curLogs_1.push(['time', 'elapsed time - tpl prepare', new Date()]);
                            return result;
                        });
                        return [4 /*yield*/, pData];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, pCompiler];
                    case 2:
                        compiler = _a.sent();
                        output = compiler.apply(void 0, [id, data, opt].concat(Object.values(opt.global)));
                        curLogs_1.push(['time', 'elapsed time - compile success', new Date()]);
                        outputDebug && outputDebugConsole(curLogs_1); // show log groups..
                        return [2 /*return*/, support.uglyInnerHTML ? output.replace(/\r\n/g, '\n') : output];
                    case 3:
                        e_1 = _a.sent();
                        e_1.message = "AJST error (ID: " + id + ") -> " + e_1.message;
                        throw e_1; // throw next
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // Preparing Template
    AJST.prepare = function (id, option) {
        if (option === void 0) { option = {}; }
        return new Promise(function (resolve, reject) {
            var opt = util_js_1.default.extend({}, DEFAULT_OPTION, option);
            var url = opt.url || opt.path.replace(/\$id/g, id);
            if (typeof url === 'function')
                url = url(id, option) || opt.path.replace(/\$id/g, id);
            try {
                if (AJST.getTemplate(id))
                    return resolved();
                (ajaxCache[url] ? ajaxCache[url] : ajaxCache[url] = util_js_1.default.ajax({
                    type: opt.ajaxType,
                    cache: opt.ajaxCache,
                    data: opt.ajaxData,
                    url: url,
                    dataType: 'html'
                })).then(function (arrTemplate) {
                    var arr = [];
                    var cnt = 0;
                    Array.prototype.forEach.call(arrTemplate, function (element, idx) {
                        // check opt.override id set
                        if (idx === 0 || !opt.override[element.id])
                            arr.push(element);
                    });
                    util_js_1.default.each(arr, function (element) {
                        if (AJST.setTemplateElement(element))
                            cnt++;
                    });
                    if (!cnt)
                        AJST.setTemplate(id, arrTemplate.htmlString);
                }).then(resolved, function () {
                    reject(new Error('AJST file not found : (ID: ' + id + ', URL: ' + url + ')'));
                });
            }
            catch (e) {
                reject(e);
            }
            function resolved() {
                try {
                    resolve(AJST.getCompiler(id, opt));
                }
                catch (e) {
                    reject(e);
                }
            }
        });
    };
    // return old AJST
    AJST.noConflict = function () { return global['AJST'] = _oldAJST; };
    // get/set Default Option
    AJST.option = function (newOption) {
        if (!newOption)
            return util_js_1.default.extend({}, DEFAULT_OPTION);
        if (util_js_1.default.isPlainObject(newOption))
            util_js_1.default.extend(DEFAULT_OPTION, newOption, CONST_OPTION);
        return true;
    };
    // Remote JSON Data
    AJST.ajax = function (id, url, option) { return AJST(id, util_js_1.default.ajax({
        url: url,
        dataType: 'json'
    }), option); };
    // AJST for iterable data (array or promise)
    AJST.each = function (id, data, option) {
        return __awaiter(this, void 0, void 0, function () {
            var list, dataPromise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data];
                    case 1:
                        list = _a.sent();
                        dataPromise = [];
                        util_js_1.default.each(list, function (v) { return dataPromise.push(AJST(id, v, option)); });
                        if (!dataPromise.length)
                            return [2 /*return*/, ''];
                        return [4 /*yield*/, Promise.all(dataPromise)];
                    case 2: return [2 /*return*/, (_a.sent()).join('')];
                }
            });
        });
    };
    // Create/Replace Template
    AJST.setTemplate = function (id, tplString) {
        tplCache[id] = CommentStripper.strip(tplString.trim());
        compileCache[id] = null;
        if (id.match(/\.js$/))
            tplCache[id] = "<? " + tplCache[id] + " ?>";
    };
    // Set template element
    AJST.setTemplateElement = function (element) {
        if (!element.id || element.tagName !== 'SCRIPT')
            return false;
        AJST.setTemplate(element.id, element.innerHTML.replace(/<!--\?/g, '<?').replace(/\?-->/g, '?>'));
        return true;
    };
    // Template auto collect
    AJST.autocollect = function () {
        if (!DEFAULT_OPTION.autocollect)
            return;
        Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), AJST.setTemplateElement);
        Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), function (element) {
            // auto replace
            if (element.getAttribute('data-ajst')) {
                var ajax = element.getAttribute('data-ajst-ajax');
                var data = element.getAttribute('data-ajst-data') ? JSON.parse(element.getAttribute('data-ajst-data')) : undefined;
                var option = element.getAttribute('data-ajst-option') ? JSON.parse(element.getAttribute('data-ajst-option')) : undefined;
                (ajax ? AJST.ajax(element.id, ajax, option) : AJST(element.id, data, option)).then(function (tplOutput) {
                    var tplElementList = util_js_1.default.parseHTML(tplOutput);
                    util_js_1.default.toArray(tplElementList).forEach(function (tplElement) {
                        element.parentNode.insertBefore(tplElement, element);
                    });
                    util_js_1.default.removeElement(element);
                }, function (e) {
                    throw e;
                });
            }
            else
                util_js_1.default.removeElement(element);
        });
    };
    // Get Template
    AJST.getTemplate = function (id) { return tplCache[id]; };
    // Get Template Compiler
    AJST.getCompiler = function (id, option) {
        if (!compileCache[id]) {
            var tplString = AJST.getTemplate(id);
            if (tplString === undefined)
                throw new Error('AJST Undefined TPL ID (ID: ' + id + ')');
            compileCache[id] = tplCompiler(tplString, option);
        }
        return compileCache[id];
    };
    DEFAULT_OPTION = {
        path: './tpl/$id',
        url: null,
        ajaxType: 'GET',
        ajaxCache: true,
        ajaxData: {},
        autocollect: true,
        override: {}
    };
    CONST_OPTION = {
        global: {
            AJST: AJST,
            util: util_js_1.default,
            Promise: Promise
        }
    };
    util_js_1.default.extend(DEFAULT_OPTION, CONST_OPTION);
    // Create Template Compiler
    var tplCompiler = function (str, option) {
        var args = '$id, data, option, ' + Object.keys(option.global).join(', '), fn = '\n\
      var print     = function(){ _s += Array.prototype.join.call(arguments,""); },\n\
          printf    = function(){ _s += sprintf.apply(this, arguments); },\n\
          uid       = util.makeUID("template");\n\
          sprintf   = util.sprintf,\n\
          _promises = [],\n\
          includeExecute = function(){\n\
            var uid     = util.makeUID("include");\n\
                syncOut = undefined,\n\
                args    = util.toArray(arguments);\n\
            util.extend(args, {2:{global:{$parent:$id},_log:option._log}});\n\
            _s += uid;\n\
            _promises.push(\n\
              this.apply(null, args).then(function(output){\n\
                syncOut = output;\n\
                _s = _s.replace(uid, output);\n\
              })\n\
            );\n\
            return syncOut !== undefined ? syncOut : uid;\n\
          },\n\
          include = function(){\n\
            return includeExecute.apply(AJST, arguments);\n\
          },\n\
          includeAjax = function(){\n\
            return includeExecute.apply(AJST.ajax, arguments);\n\
          },\n\
          includeEach = function(id, data, option){\n\
            return includeExecute.apply(AJST.each, arguments);\n\
          };\n\
      var _s = \'' + str.replace(regexp_remove_ws, replace_remove_ws).replace(regexp_compile, replace_compile).replace(regexp_escape, replace_escape) + '\';\n\
      return Promise.all(_promises).then(function(){\n\
        return _s;\n\
      });';
        try {
            return new Function(args, fn);
        }
        catch (e) {
            if (option.debug) {
                console.log('AJST tplCompiler Debug');
                console.log(e.message);
                console.log('template :', str);
                console.log('option :', option);
                console.log('args: ', args);
                console.log('fn: ', fn);
            }
            throw e;
        }
    };
    var regexp_remove_ws = /(?:<\?([\s\S]+?)\?>)/g;
    var replace_remove_ws = function (s) { return s
        .split('\n')
        .join(' ')
        .replace(/'/g, '_ESCAPE__1_')
        .replace(/"/g, '_ESCAPE__2_')
        .replace(/\\n/g, '_ESCAPE__NEWLINE_'); };
    var regexp_escape = /_ESCAPE__1_|_ESCAPE__2_|{{script}}|{{\/script}}|_ESCAPE__NEWLINE_/g;
    var replace_escape = function (s) {
        return {
            _ESCAPE__1_: '\'',
            _ESCAPE__2_: '"',
            '{{script}}': '<script>',
            '{{/script}}': '</script>',
            _ESCAPE__NEWLINE_: '\\n'
        }[s] || s;
    };
    var regexp_compile = /([\s'\\])(?![^\?]*\?>)|(?:<\?(=)([\s\S]+?)\?>)|(<\?)|(\?>)/g;
    var replace_compile = function (s, p1, p2, p3, p4, p5) {
        if (p1)
            return {
                '\n': '\\n',
                '\r': '\\r',
                '\t': '\\t',
                ' ': ' '
            }[s] || '\\' + s;
        if (p2)
            return "'+(" + p3 + ")+'";
        if (p4)
            return "';\n";
        if (p5)
            return ";\n_s+='";
    };
    global['AJST'] = AJST;
    // window event bind for autocollect
    if (support.addEventListener)
        document.addEventListener('DOMContentLoaded', AJST.autocollect, false);
    else
        document['attachEvent']('onreadystatechange', AJST.autocollect);
    exports.default = AJST;
});
//# sourceMappingURL=AJST.js.map
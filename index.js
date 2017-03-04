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
define("lib/CommentStripper", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CommentStripper = (function () {
        var CommentStripper = function () { var i = '/', r = '\\', n = '*', e = '"', s = "'", h = '\n', o = '\r', u = function () { }; return u.prototype = { string: '', length: 0, position: 0, output: null, getCurrentCharacter: function () { return this.string.charAt(this.position); }, getPreviousCharacter: function () { return this.string.charAt(this.position - 1); }, getNextCharacter: function () { return this.string.charAt(this.position + 1); }, add: function () { this.output.push(this.getCurrentCharacter()); }, next: function () { this.position++; }, atEnd: function () { return this.position >= this.length; }, isEscaping: function () { if (this.getPreviousCharacter() === r) {
                for (var t = this.position - 1, i_1 = !1; t > 0;) {
                    if (this.string.charAt(t--) !== r)
                        return i_1;
                    i_1 = !i_1;
                }
                return i;
            } return !1; }, processSingleQuotedString: function () { if (this.getCurrentCharacter() === s)
                for (this.add(), this.next(); !this.atEnd();) {
                    if (this.getCurrentCharacter() === s && !this.isEscaping())
                        return;
                    this.add(), this.next();
                } }, processDoubleQuotedString: function () { if (this.getCurrentCharacter() === e)
                for (this.add(), this.next(); !this.atEnd();) {
                    if (this.getCurrentCharacter() === e && !this.isEscaping())
                        return;
                    this.add(), this.next();
                } }, processSingleLineComment: function () { if (this.getCurrentCharacter() === i && this.getNextCharacter() === i)
                for (this.next(); !this.atEnd();)
                    if (this.next(), this.getCurrentCharacter() === h || this.getCurrentCharacter() === o)
                        return; }, processMultiLineComment: function () { if (this.getCurrentCharacter() === i && this.getNextCharacter() === n)
                for (; !this.atEnd();)
                    if (this.next(), this.getCurrentCharacter() === n && this.getNextCharacter() === i)
                        return this.next(), void this.next(); }, process: function () { for (; !this.atEnd();)
                this.processDoubleQuotedString(), this.processSingleQuotedString(), this.processSingleLineComment(), this.processMultiLineComment(), this.atEnd() || (this.add(), this.next()); }, reset: function () { this.string = '', this.length = 0, this.position = 0, this.output = []; }, strip: function (t) { return this.reset(), this.string = t, this.length = this.string.length, this.process(), this.output.join(''); } }, null, u; }();
        return new CommentStripper();
    })();
});
define("lib/sprintf", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Return a formatted string
     * discuss at: http://phpjs.org/functions/sprintf
     */
    function sprintf() {
        var i = 0;
        var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
        var a = arguments, format = a[i++];
        var pad = function (str, len, chr, leftJustify) {
            if (!chr) {
                chr = ' ';
            }
            var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;
        };
        var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            if (zeroPad === void 0) { zeroPad = undefined; }
            if (customPadChar === void 0) { customPadChar = undefined; }
            var diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, customPadChar, leftJustify);
                }
                else {
                    value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
                }
            }
            return value;
        };
        var formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            var number = value >>> 0;
            prefix = prefix && number && { '2': '0b', '8': '0', '16': '0x' }[base] || '';
            value = prefix + pad(number.toString(base), precision || 0, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        };
        var formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
            if (customPadChar === void 0) { customPadChar = undefined; }
            if (precision != null) {
                value = value.slice(0, precision);
            }
            return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
        };
        var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
            var number;
            var prefix;
            var method;
            var textTransform;
            var value;
            if (substring === '%%') {
                return '%';
            }
            var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, customPadChar = ' ';
            var flagsl = flags.length;
            for (var j = 0; flags && j < flagsl; j++) {
                switch (flags.charAt(j)) {
                    case ' ':
                        positivePrefix = ' ';
                        break;
                    case '+':
                        positivePrefix = '+';
                        break;
                    case '-':
                        leftJustify = true;
                        break;
                    case "'":
                        customPadChar = flags.charAt(j + 1);
                        break;
                    case '0':
                        zeroPad = true;
                        break;
                    case '#':
                        prefixBaseX = true;
                        break;
                }
            }
            if (!minWidth) {
                minWidth = 0;
            }
            else if (minWidth === '*') {
                minWidth = +a[i++];
            }
            else if (minWidth.charAt(0) === '*') {
                minWidth = +a[minWidth.slice(1, -1)];
            }
            else {
                minWidth = +minWidth;
            }
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }
            if (!isFinite(minWidth)) {
                throw new Error('sprintf: (minimum-)width must be finite');
            }
            if (!precision) {
                precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
            }
            else if (precision === '*') {
                precision = +a[i++];
            }
            else if (precision.charAt(0) === '*') {
                precision = +a[precision.slice(1, -1)];
            }
            else {
                precision = +precision;
            }
            value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
            switch (type) {
                case 's':
                    return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
                case 'c':
                    return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
                case 'b':
                    return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'o':
                    return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'x':
                    return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'X':
                    return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
                case 'u':
                    return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'i':
                case 'd':
                    number = (+value) | 0;
                    prefix = number < 0 ? '-' : positivePrefix;
                    value = prefix + pad(String(Math.abs(number)), precision, '0', false);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad);
                case 'e':
                case 'E':
                case 'f':
                case 'F':
                case 'g':
                case 'G':
                    number = +value;
                    prefix = number < 0 ? '-' : positivePrefix;
                    method = ['toExponential', 'toFixed', 'toPrecision']['efg'.indexOf(type.toLowerCase())];
                    textTransform = ['toString', 'toUpperCase']['eEfFgG'.indexOf(type) % 2];
                    value = prefix + Math.abs(number)[method](precision);
                    return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]();
                default:
                    return substring;
            }
        };
        return format.replace(regex, doFormat);
    }
    exports.sprintf = sprintf;
});
define("lib/UTIL", ["require", "exports", "lib/CommentStripper", "lib/sprintf"], function (require, exports, CommentStripper_js_1, sprintf_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var documentMode = window.documentMode;
    exports.support = {
        addEventListener: !!document.addEventListener,
        argumentsSlice: !(documentMode && documentMode <= 8),
        uglyInnerHTML: documentMode && documentMode <= 8,
        cors: 'withCredentials' in new XMLHttpRequest()
    };
    exports.outputDebugConsole = function (logList) {
        var id = logList.id, now = logList.now, isRoot = logList.isRoot;
        console[isRoot ? 'groupCollapsed' : 'group'].call(console, 'AJST TPL -', id);
        logList.forEach(function (log) {
            if (log.id && log.now)
                return exports.outputDebugConsole(log);
            else if (log[0] === 'time')
                console.log(log[1], log[2] - now + 'ms');
            else
                console[log[0]].apply(console, log.slice(1, log.length));
        });
        console.groupEnd();
    };
    exports.UTIL = {
        CommentStripper: CommentStripper_js_1.CommentStripper,
        support: exports.support,
        sprintf: sprintf_js_1.sprintf,
        param: param,
        outputDebugConsole: exports.outputDebugConsole,
        each: function (o, eachFunction) {
            if (exports.UTIL.isArray(o))
                o.forEach(eachFunction);
            else if (exports.UTIL.isPlainObject(o))
                Object.keys(o).forEach(function (key) {
                    eachFunction(o[key], key, o);
                });
            else if (o && o.length) {
                for (var i = 0, len = o.length; i < len; i++)
                    eachFunction(o[i], i, o);
            }
        },
        toArray: function (o) {
            if (!exports.support.argumentsSlice) {
                var ret_1 = [];
                exports.UTIL.each(o, function (x) {
                    ret_1.push(x);
                });
                return ret_1;
            }
            else
                return Array.prototype.slice.call(o);
        },
        tag_escape: function (s) {
            return s.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#039;').replace(/"/g, '&quot;');
        },
        tag_unescape: function (s) {
            return s.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#0*39;/g, '\'').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        },
        makeUID: function (prefix) {
            return (prefix || '') + (+(new Date())) + exports.UTIL.randomFromTo(0, 9999999999);
        },
        randomFromTo: function (from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        },
        isFunction: function (o) {
            return typeof o === 'function';
        },
        isArray: function (o) {
            return o && o.constructor === Array;
        },
        isPlainObject: function (o) {
            if (!o || typeof o !== 'object' || String(o) !== '[object Object]')
                return false;
            var ctor = typeof o.constructor === 'function' && o.constructor.prototype;
            if (!ctor || !Object.hasOwnProperty.call(ctor, 'isPrototypeOf'))
                return false;
            var key;
            for (key in o) { }
            return key === undefined || Object.hasOwnProperty.call(o, key);
        },
        removeElement: function (element) {
            element.parentNode.removeChild(element);
        },
        extend: function (o) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            Array.prototype.slice.call(arguments, 1).forEach(function (source) {
                if (source) {
                    for (var prop in source) {
                        if (exports.UTIL.isPlainObject(source[prop])) {
                            if (!o[prop] || exports.UTIL.isPlainObject(o[prop])) {
                                o[prop] = o[prop] || {};
                                exports.UTIL.extend(o[prop], source[prop]);
                            }
                            else {
                                o[prop] = source[prop];
                            }
                        }
                        else {
                            o[prop] = source[prop];
                        }
                    }
                }
            });
            return o;
        },
        parseHTML: function (htmlString) {
            var container = document.createElement('div');
            if (exports.support.uglyInnerHTML) {
                container.innerHTML = '_' + htmlString;
                container.removeChild(container.firstChild);
            }
            else
                container.innerHTML = htmlString;
            container.childNodes['htmlString'] = htmlString;
            return container.childNodes;
        },
        parseXML: function (xmlString) {
            return (new DOMParser()).parseFromString(xmlString, 'application/xml');
        },
        ajax: function (option) {
            return new Promise(function (resolve, reject) {
                var opt = exports.UTIL.extend({
                    type: 'GET',
                    url: '.',
                    header: { 'Content-Type': 'text/plain; charset=utf-8' },
                    data: {},
                    dataType: 'text',
                    cache: true
                }, option);
                opt.type = opt.type.toUpperCase();
                if (opt.type === 'GET' && !opt.cache)
                    opt.data._timestamp = +(new Date());
                newXMLHttpRequest();
                function newXMLHttpRequest() {
                    var xhr;
                    if (!exports.support.cors && opt.useCors && XDomainRequest) {
                        xhr = new XDomainRequest();
                        xhr.onload = function () {
                            xhr.readyState = 4;
                            xhr.status = 200;
                            xhr.onreadystatechange();
                        };
                    }
                    else if (XMLHttpRequest)
                        xhr = new XMLHttpRequest();
                    else if (ActiveXObject) {
                        try {
                            xhr = new ActiveXObject('Msxml2.XMLHTTP');
                        }
                        catch (e) {
                            try {
                                xhr = new ActiveXObject('Microsoft.XMLHTTP');
                            }
                            catch (e) { }
                        }
                    }
                    if (!xhr)
                        throw new Error('This browser does not support XMLHttpRequest.');
                    sendRequest(xhr);
                }
                function sendRequest(xhr) {
                    var body = exports.UTIL.isPlainObject(opt.data) ? exports.UTIL.param(opt.data) : opt.data;
                    xhr.onerror = reject;
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState !== 4)
                            return;
                        else if (xhr.status >= 200 && xhr.status < 400)
                            resolve(parseDataType(xhr.responseText.replace(/\r\n/g, '\n')));
                        else if (xhr.status > 400)
                            reject(new Error('AJST Ajax error(status: ' + (xhr.status || 404) + ') - ' + opt.url));
                    };
                    if (opt.type === 'POST') {
                        opt.header['Content-Type'] = 'application/x-www-form-urlencoded';
                    }
                    else if (body) {
                        opt.url += (opt.url.indexOf('?') > -1 ? '&' : '?') + body;
                        body = null;
                    }
                    xhr.open(opt.type, opt.url);
                    if (xhr.setRequestHeader) {
                        for (var key in opt.header)
                            xhr.setRequestHeader(key, opt.header[key]);
                    }
                    xhr.send(body);
                }
                function parseDataType(source) {
                    switch (opt.dataType.toLowerCase()) {
                        case 'html':
                            return exports.UTIL.parseHTML(source);
                        case 'xml':
                            return exports.UTIL.parseXML(source);
                        case 'json':
                            return JSON.parse(source);
                    }
                    return source || '';
                }
            });
        }
    };
    function param(a) {
        var s = [];
        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for (var prefix in a) {
            buildParams(prefix, a[prefix]);
        }
        // Return the resulting serialization
        return s.join('&').replace(/%20/g, '+');
        function add(key, value) {
            // If value is a function, invoke it and return its value
            value = exports.UTIL.isFunction(value) ? value() : value;
            s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
        function buildParams(prefix, obj) {
            if (exports.UTIL.isArray(obj)) {
                // Serialize array item.
                obj.forEach(function (v, i) {
                    buildParams(prefix + '[' + (typeof v === 'object' || exports.UTIL.isArray(v) ? i : '') + ']', v);
                });
            }
            else if (obj != null && typeof obj === 'object') {
                // Serialize object item.
                for (var k in obj)
                    buildParams(prefix + '[' + k + ']', obj[k]);
            }
            else {
                // Serialize scalar item.
                add(prefix, obj);
            }
        }
    }
    /**
     * Browser Compatibility
     */
    (function (global, console) {
        // tslint:disable:no-console
        var fn = new Function();
        /**
         * console implementation for IE
         */
        console.clear = console.clear || fn;
        console.log = console.log || fn;
        console.info = console.info || console.log;
        console.warn = console.warn || console.log;
        console.error = console.error || console.log;
        console.dir = console.dir || console.log;
        console.debug = console.debug || console.dir;
        console.timeCounters = console.timeCounters || {};
        console.time = console.time || function (name, reset) {
            if (!name || (!reset && console.timeCounters[name]))
                return;
            console.timeCounters[name] = +(new Date());
        };
        console.timeEnd = console.timeEnd || function (name) {
            if (!console.timeCounters[name])
                return;
            var diff = +(new Date()) - console.timeCounters[name];
            console.info(name + ': ' + diff + 'ms');
            delete console.timeCounters[name];
            return diff;
        };
        /**
         * IE7 document.querySelectorAll
         */
        if (global.document && !global.document.querySelectorAll) {
            (function (document) {
                var a = document.styleSheets.length ? document.styleSheets[0] : document.createStyleSheet();
                document.querySelectorAll = function (e) {
                    a.addRule(e, 'f:b');
                    var c = [];
                    for (var l = document.all, b = 0, f = l.length; b < f; b++)
                        l[b].currentStyle.f && c.push(l[b]);
                    a.removeRule(0);
                    return c;
                };
            })(global.document);
        }
    })(this || window, (this || window).console || {});
});
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
define("ajst", ["require", "exports", "lib/UTIL"], function (require, exports, UTIL_js_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var outputDebugConsole = UTIL_js_1.UTIL.outputDebugConsole, support = UTIL_js_1.UTIL.support, CommentStripper = UTIL_js_1.UTIL.CommentStripper;
    var global = window;
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
                        opt = UTIL_js_1.UTIL.extend({}, DEFAULT_OPTION, option);
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
            var opt = UTIL_js_1.UTIL.extend({}, DEFAULT_OPTION, option);
            var url = opt.url || opt.path.replace(/\$id/g, id);
            if (typeof url === 'function')
                url = url(id, option) || opt.path.replace(/\$id/g, id);
            try {
                if (AJST.getTemplate(id))
                    return resolved();
                (ajaxCache[url] ? ajaxCache[url] : ajaxCache[url] = UTIL_js_1.UTIL.ajax({
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
                    UTIL_js_1.UTIL.each(arr, function (element) {
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
            return UTIL_js_1.UTIL.extend({}, DEFAULT_OPTION);
        if (UTIL_js_1.UTIL.isPlainObject(newOption))
            UTIL_js_1.UTIL.extend(DEFAULT_OPTION, newOption, CONST_OPTION);
        return true;
    };
    // Remote JSON Data
    AJST.ajax = function (id, url, option) { return AJST(id, UTIL_js_1.UTIL.ajax({
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
                        UTIL_js_1.UTIL.each(list, function (v) { return dataPromise.push(AJST(id, v, option)); });
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
                    var tplElementList = UTIL_js_1.UTIL.parseHTML(tplOutput);
                    UTIL_js_1.UTIL.toArray(tplElementList).forEach(function (tplElement) {
                        element.parentNode.insertBefore(tplElement, element);
                    });
                    UTIL_js_1.UTIL.removeElement(element);
                }, function (e) {
                    throw e;
                });
            }
            else
                UTIL_js_1.UTIL.removeElement(element);
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
            util: UTIL_js_1.UTIL,
            Promise: Promise
        }
    };
    UTIL_js_1.UTIL.extend(DEFAULT_OPTION, CONST_OPTION);
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
    // for module system
    exports.default = AJST;
});
//# sourceMappingURL=index.js.map
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

'use strict';

/**
 * Return a formatted string
 * discuss at: http://phpjs.org/functions/sprintf
 */
function sprintf() {
    let i = 0;
    const regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
    const a = arguments, format = a[i++];
    const pad = function (str, len, chr, leftJustify) {
        if (!chr) {
            chr = ' ';
        }
        const padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
        return leftJustify ? str + padding : padding + str;
    };
    const justify = function (value, prefix, leftJustify, minWidth, zeroPad = undefined, customPadChar = undefined) {
        const diff = minWidth - value.length;
        if (diff > 0) {
            if (leftJustify || !zeroPad) {
                value = pad(value, minWidth, customPadChar, leftJustify);
            } else {
                value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
        }
        return value;
    };
    const formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
        const number = value >>> 0;
        prefix = prefix && number && { '2': '0b', '8': '0', '16': '0x' }[base] || '';
        value = prefix + pad(number.toString(base), precision || 0, '0', false);
        return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };
    const formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar = undefined) {
        if (precision != null) {
            value = value.slice(0, precision);
        }
        return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };
    const doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
        let number;
        let prefix;
        let method;
        let textTransform;
        let value;
        if (substring === '%%') {
            return '%';
        }
        let leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, customPadChar = ' ';
        let flagsl = flags.length;
        for (let j = 0; flags && j < flagsl; j++) {
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
                case `'`:
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
        } else if (minWidth === '*') {
            minWidth = +a[i++];
        } else if (minWidth.charAt(0) === '*') {
            minWidth = +a[minWidth.slice(1, -1)];
        } else {
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
        } else if (precision === '*') {
            precision = +a[i++];
        } else if (precision.charAt(0) === '*') {
            precision = +a[precision.slice(1, -1)];
        } else {
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

const CommentStripper = (() => { // tslint:disable-next-line:whitespace
    const CommentStripper = function () { let i = '/', r = '\\', n = '*', e = '"', s = `'`, h = '\n', o = '\r', u = function () { }; return u.prototype = { string: '', length: 0, position: 0, output: null, getCurrentCharacter: function () { return this.string.charAt(this.position); }, getPreviousCharacter: function () { return this.string.charAt(this.position - 1); }, getNextCharacter: function () { return this.string.charAt(this.position + 1); }, add: function () { this.output.push(this.getCurrentCharacter()); }, next: function () { this.position++; }, atEnd: function () { return this.position >= this.length; }, isEscaping: function () { if (this.getPreviousCharacter() === r) { for (let t = this.position - 1, i = !1; t > 0;) { if (this.string.charAt(t--) !== r) return i; i = !i; } return i; } return !1; }, processSingleQuotedString: function () { if (this.getCurrentCharacter() === s) for (this.add(), this.next(); !this.atEnd();) { if (this.getCurrentCharacter() === s && !this.isEscaping()) return; this.add(), this.next(); } }, processDoubleQuotedString: function () { if (this.getCurrentCharacter() === e) for (this.add(), this.next(); !this.atEnd();) { if (this.getCurrentCharacter() === e && !this.isEscaping()) return; this.add(), this.next(); } }, processSingleLineComment: function () { if (this.getCurrentCharacter() === i && this.getNextCharacter() === i) for (this.next(); !this.atEnd();)if (this.next(), this.getCurrentCharacter() === h || this.getCurrentCharacter() === o) return; }, processMultiLineComment: function () { if (this.getCurrentCharacter() === i && this.getNextCharacter() === n) for (; !this.atEnd();)if (this.next(), this.getCurrentCharacter() === n && this.getNextCharacter() === i) return this.next(), void this.next(); }, process: function () { for (; !this.atEnd();)this.processDoubleQuotedString(), this.processSingleQuotedString(), this.processSingleLineComment(), this.processMultiLineComment(), this.atEnd() || (this.add(), this.next()); }, reset: function () { this.string = '', this.length = 0, this.position = 0, this.output = []; }, strip: function (t) { return this.reset(), this.string = t, this.length = this.string.length, this.process(), this.output.join(''); } }, null, u; }();
    return new CommentStripper();
})();

const documentMode: number = (<any>window).documentMode;

const support = {
    addEventListener: !!document.addEventListener,
    argumentsSlice: !(documentMode && documentMode <= 8),
    uglyInnerHTML: documentMode && documentMode <= 8,
    cors: 'withCredentials' in new XMLHttpRequest()
};

const outputDebugConsole = logList => {

    const id = logList.id, now = logList.now, isRoot = logList.isRoot;

    console[isRoot ? 'groupCollapsed' : 'group'].call(console, 'AJST TPL -', id);

    logList.forEach(log => {

        if (log.id && log.now)
            return outputDebugConsole(log);
        else if (log[0] === 'time')
            console.log(log[1], log[2] - now + 'ms');
        else
            console[log[0]].apply(console, log.slice(1, log.length));

    });

    console.groupEnd();

};

export const UTIL = {
    support,
    sprintf,
    param,
    CommentStripper,
    outputDebugConsole,
    each: function (o, eachFunction) {
        if (UTIL.isArray(o))
            o.forEach(eachFunction);
        else if (UTIL.isPlainObject(o))
            Object.keys(o).forEach(function (key) {
                eachFunction(o[key], key, o);
            });
        else if (o && o.length) {
            for (let i = 0, len = o.length; i < len; i++)
                eachFunction(o[i], i, o);
        }
    },
    toArray: function (o) {
        if (!support.argumentsSlice) {
            const ret = [];
            UTIL.each(o, function (x) {
                ret.push(x);
            });
            return ret;
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
        return (prefix || '') + (+(new Date())) + UTIL.randomFromTo(0, 9999999999);
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
        const ctor = typeof o.constructor === 'function' && o.constructor.prototype;
        if (!ctor || !Object.hasOwnProperty.call(ctor, 'isPrototypeOf'))
            return false;
        let key;
        for (key in o) { }
        return key === undefined || Object.hasOwnProperty.call(o, key);
    },
    removeElement: function (element) {
        element.parentNode.removeChild(element);
    },
    extend: function (o, ...args) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source) {
            if (source) {
                for (let prop in source) {
                    if (UTIL.isPlainObject(source[prop])) {
                        if (!o[prop] || UTIL.isPlainObject(o[prop])) {
                            o[prop] = o[prop] || {};
                            UTIL.extend(o[prop], source[prop]);
                        } else {
                            o[prop] = source[prop];
                        }
                    } else {
                        o[prop] = source[prop];
                    }
                }
            }
        });
        return o;
    },
    parseHTML: function (htmlString) {

        let container = document.createElement('div');

        if (support.uglyInnerHTML) {
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

            const opt = UTIL.extend({
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

                let xhr;

                if (!support.cors && opt.useCors && XDomainRequest) {
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
                        catch (e) {/**/ }
                    }
                }

                if (!xhr)
                    throw new Error('This browser does not support XMLHttpRequest.');

                sendRequest(xhr);

            }

            function sendRequest(xhr) {

                let body = UTIL.isPlainObject(opt.data) ? UTIL.param(opt.data) : opt.data;

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
                    for (let key in opt.header)
                        xhr.setRequestHeader(key, opt.header[key]);
                }

                xhr.send(body);

            }

            function parseDataType(source) {

                switch (opt.dataType.toLowerCase()) {
                    case 'html':
                        return UTIL.parseHTML(source);
                    case 'xml':
                        return UTIL.parseXML(source);
                    case 'json':
                        return JSON.parse(source);
                }

                return source || '';

            }

        });

    }
};

function param(a) {

    const s = [];

    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for (let prefix in a) {
        buildParams(prefix, a[prefix]);
    }

    // Return the resulting serialization
    return s.join('&').replace(/%20/g, '+');

    function add(key, value) {
        // If value is a function, invoke it and return its value
        value = UTIL.isFunction(value) ? value() : value;
        s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }

    function buildParams(prefix, obj) {
        if (UTIL.isArray(obj)) {
            // Serialize array item.
            obj.forEach(function (v, i) {

                buildParams(prefix + '[' + (typeof v === 'object' || UTIL.isArray(v) ? i : '') + ']', v);

            });

        } else if (obj != null && typeof obj === 'object') {
            // Serialize object item.
            for (let k in obj)
                buildParams(prefix + '[' + k + ']', obj[k]);

        } else {
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

    const fn = new Function();

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
        const diff = +(new Date()) - console.timeCounters[name];
        console.info(name + ': ' + diff + 'ms');
        delete console.timeCounters[name];
        return diff;
    };

    /**
     * IE7 document.querySelectorAll
     */
    if (global.document && !global.document.querySelectorAll) {
        (function (document) {
            const a = document.styleSheets.length ? document.styleSheets[0] : document.createStyleSheet();
            document.querySelectorAll = function (e) {
                a.addRule(e, 'f:b');
                let c = [];
                for (let l = document.all, b = 0, f = l.length; b < f; b++)
                    l[b].currentStyle.f && c.push(l[b]);
                a.removeRule(0);
                return c;
            };
        })(global.document);
    }

})(this || window, (this || window).console || {});

const global = window;

const _oldAJST = global['AJST'];

let DEFAULT_OPTION: AJST.AJSTOption;
let CONST_OPTION: AJST.AJSTOption;

// Template String Cache
const tplCache: AJST.AJSTTemplateContainer = {};

// Ajax URL Cache
const ajaxCache: AJST.AJSTAjaxContainer = {};

// Template Compiler Cache
const compileCache: AJST.AJSTCompilerContainer = {};

// Template Process
let AJST: AJST.AJST;
AJST = <AJST.AJST>async function (id, data = undefined, option = undefined) {

    try {

        option = option || {};

        const curLogs = [];
        const parentLogs = option['_log'] || [];
        const opt = UTIL.extend({}, DEFAULT_OPTION, option);

        curLogs['id'] = id;
        curLogs['now'] = new Date();
        curLogs['isRoot'] = !opt.global.$parent;

        const outputDebug = !!(curLogs['isRoot'] && opt.debug);

        parentLogs.push(curLogs);

        opt._log = curLogs;

        let pData = Promise.resolve(typeof data === 'function' ? data() : data).then(result => {
            curLogs.push(['time', 'elapsed time - data', new Date()]);
            curLogs.push(['log', 'data', result]);
            return result;
        });

        let pCompiler = AJST.prepare(id, opt).then(result => {
            curLogs.push(['time', 'elapsed time - tpl prepare', new Date()]);
            return result;
        });

        data = await pData;

        const compiler = await pCompiler;
        const output = compiler(id, data, opt, ...Object.values(opt.global)); // generate output text

        curLogs.push(['time', 'elapsed time - compile success', new Date()]);

        outputDebug && outputDebugConsole(curLogs); // show log groups..

        return support.uglyInnerHTML ? output.replace(/\r\n/g, '\n') : output;

    }
    catch (e) {
        e.message = `AJST error (ID: ${id}) -> ${e.message}`;
        throw e; // throw next
    }
};

// Preparing Template
AJST.prepare = function (id, option = {}) {

    return new Promise(function (resolve, reject) {

        const opt = UTIL.extend({}, DEFAULT_OPTION, option);
        let url = opt.url || opt.path.replace(/\$id/g, id);

        if (typeof url === 'function')
            url = url(id, option) || opt.path.replace(/\$id/g, id);

        try {

            if (AJST.getTemplate(id)) // aready have..
                return resolved();

            (ajaxCache[url] ? ajaxCache[url] : ajaxCache[url] = UTIL.ajax({
                type: opt.ajaxType,
                cache: opt.ajaxCache,
                data: opt.ajaxData,
                url: url,
                dataType: 'html'
            })).then(function (arrTemplate) {

                const arr = [];
                let cnt = 0;

                Array.prototype.forEach.call(arrTemplate, function (element, idx) {
                    // check opt.override id set
                    if (idx === 0 || !opt.override[element.id]) arr.push(element);
                });

                UTIL.each(arr, function (element) {
                    if (AJST.setTemplateElement(element)) cnt++;
                });

                if (!cnt)
                    AJST.setTemplate(id, arrTemplate.htmlString);

            }).then(resolved, function () {
                reject(new Error('AJST file not found : (ID: ' + id + ', URL: ' + url + ')'));
            });

        } catch (e) { reject(e); }

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
AJST.noConflict = () => global['AJST'] = _oldAJST;

// get/set Default Option
AJST.option = (newOption) => {
    if (!newOption)
        return UTIL.extend({}, DEFAULT_OPTION);
    if (UTIL.isPlainObject(newOption))
        UTIL.extend(DEFAULT_OPTION, newOption, CONST_OPTION);
    return true;
};

// Remote JSON Data
AJST.ajax = (id, url, option) => AJST(id, UTIL.ajax({
    url,
    dataType: 'json'
}), option);

// AJST for iterable data (array or promise)
AJST.each = async function (id, data, option) {

    const list = await data; // resolve promise
    const dataPromise: Promise<string>[] = [];

    UTIL.each(list, v => dataPromise.push(AJST(id, v, option)));

    if (!dataPromise.length)
        return '';

    return (await Promise.all(dataPromise)).join('');

};

// Create/Replace Template
AJST.setTemplate = (id, tplString) => {

    tplCache[id] = CommentStripper.strip(tplString.trim());
    compileCache[id] = null;

    if (id.match(/\.js$/))
        tplCache[id] = `<? ${tplCache[id]} ?>`;

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

            const ajax = element.getAttribute('data-ajst-ajax');
            const data = element.getAttribute('data-ajst-data') ? JSON.parse(element.getAttribute('data-ajst-data')) : undefined;
            const option = element.getAttribute('data-ajst-option') ? JSON.parse(element.getAttribute('data-ajst-option')) : undefined;

            (ajax ? AJST.ajax(element.id, ajax, option) : AJST(element.id, data, option)).then(function (tplOutput) {

                const tplElementList = UTIL.parseHTML(tplOutput);

                UTIL.toArray(tplElementList).forEach(function (tplElement) {
                    element.parentNode.insertBefore(tplElement, element);
                });

                UTIL.removeElement(element);

            }, function (e) {

                throw e;

            });

        }

        else
            UTIL.removeElement(element);

    });

};

// Get Template
AJST.getTemplate = id => tplCache[id];

// Get Template Compiler
AJST.getCompiler = (id, option) => {

    if (!compileCache[id]) {
        const tplString = AJST.getTemplate(id);
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
        util: UTIL,
        Promise: Promise
    }
};

UTIL.extend(DEFAULT_OPTION, CONST_OPTION);

// Create Template Compiler
const tplCompiler = (str: string, option: any) => {

    const args = '$id, data, option, ' + Object.keys(option.global).join(', '),
        fn = '\n\
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

        return <AJST.AJSTCompiler>new Function(args, fn);

    } catch (e) {

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

const regexp_remove_ws = /(?:<\?([\s\S]+?)\?>)/g;
const replace_remove_ws = s => s
    .split('\n')
    .join(' ')
    .replace(/'/g, '_ESCAPE__1_')
    .replace(/"/g, '_ESCAPE__2_')
    .replace(/\\n/g, '_ESCAPE__NEWLINE_');
const regexp_escape = /_ESCAPE__1_|_ESCAPE__2_|{{script}}|{{\/script}}|_ESCAPE__NEWLINE_/g;
const replace_escape = s => {
    return {
        _ESCAPE__1_: '\'',
        _ESCAPE__2_: '"',
        '{{script}}': '<script>',
        '{{/script}}': '</script>',
        _ESCAPE__NEWLINE_: '\\n'
    }[s] || s;
};
const regexp_compile = /([\s'\\])(?![^\?]*\?>)|(?:<\?(=)([\s\S]+?)\?>)|(<\?)|(\?>)/g;
const replace_compile = (s, p1, p2, p3, p4, p5) => {
    if (p1) // whitespace, quote and backslash in interpolation context
        return {
            '\n': '\\n',
            '\r': '\\r',
            '\t': '\\t',
            ' ': ' '
        }[s] || '\\' + s;
    if (p2) // interpolation: <?=prop?>
        return `'+(${p3})+'`;
    if (p4) // evaluation start tag: <?
        return `';\n`;
    if (p5) // evaluation end tag: ?>
        return `;\n_s+='`;
};

global['AJST'] = AJST;

// window event bind for autocollect
if (support.addEventListener)
    document.addEventListener('DOMContentLoaded', AJST.autocollect, false);
else
    document['attachEvent']('onreadystatechange', AJST.autocollect);

export default AJST;

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
System.register("ajst/ns", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("ajst/lib/CommentStripper", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var CommentStripper;
    return {
        setters: [],
        execute: function () {
            exports_2("CommentStripper", CommentStripper = (() => {
                const CommentStripper = function () { let i = '/', r = '\\', n = '*', e = '"', s = `'`, h = '\n', o = '\r', u = function () { }; return u.prototype = { string: '', length: 0, position: 0, output: null, getCurrentCharacter: function () { return this.string.charAt(this.position); }, getPreviousCharacter: function () { return this.string.charAt(this.position - 1); }, getNextCharacter: function () { return this.string.charAt(this.position + 1); }, add: function () { this.output.push(this.getCurrentCharacter()); }, next: function () { this.position++; }, atEnd: function () { return this.position >= this.length; }, isEscaping: function () { if (this.getPreviousCharacter() === r) {
                        for (let t = this.position - 1, i = !1; t > 0;) {
                            if (this.string.charAt(t--) !== r)
                                return i;
                            i = !i;
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
            })());
        }
    };
});
System.register("ajst/lib/sprintf", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function sprintf() {
        let i = 0;
        const regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
        const a = arguments, format = a[i++];
        const pad = function (str, len, chr, leftJustify) {
            if (!chr)
                chr = ' ';
            const padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;
        };
        const justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            const diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad)
                    value = pad(value, minWidth, customPadChar, leftJustify);
                else
                    value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
            }
            return value;
        };
        const formatBaseX = function (value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
            const number = value >>> 0;
            prefix = prefix && number && { '2': '0b', '8': '0', '16': '0x' }[base] || '';
            value = prefix + pad(number.toString(base), precision || 0, '0', false);
            return justify(value, prefix, leftJustify, minWidth, zeroPad);
        };
        const formatString = function (value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
            if (precision != null) {
                value = value.slice(0, precision);
            }
            return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
        };
        const doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
            let number, prefix, method, textTransform, value, leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, customPadChar = ' ', flagsl = flags.length;
            if (substring === '%%')
                return '%';
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
            if (!minWidth)
                minWidth = 0;
            else if (minWidth === '*')
                minWidth = +a[i++];
            else if (minWidth.charAt(0) === '*')
                minWidth = +a[minWidth.slice(1, -1)];
            else
                minWidth = +minWidth;
            if (minWidth < 0) {
                minWidth = -minWidth;
                leftJustify = true;
            }
            if (!isFinite(minWidth))
                throw new Error('sprintf: (minimum-)width must be finite');
            if (!precision)
                precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0 : undefined;
            else if (precision === '*')
                precision = +a[i++];
            else if (precision.charAt(0) === '*')
                precision = +a[precision.slice(1, -1)];
            else
                precision = +precision;
            value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];
            switch (type) {
                case 's': return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
                case 'c': return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
                case 'b': return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'o': return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'x': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
                case 'X': return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
                case 'u': return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
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
                default: return substring;
            }
        };
        return format.replace(regex, doFormat);
    }
    exports_3("sprintf", sprintf);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("ajst/lib/UTIL", ["ajst/lib/CommentStripper", "ajst/lib/sprintf"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    function param(a) {
        const s = [];
        for (let prefix in a) {
            buildParams(prefix, a[prefix]);
        }
        return s.join('&').replace(/%20/g, '+');
        function add(key, value) {
            value = UTIL.isFunction(value) ? value() : value;
            s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
        function buildParams(prefix, obj) {
            if (UTIL.isArray(obj)) {
                obj.forEach(function (v, i) {
                    buildParams(prefix + '[' + (typeof v === 'object' || UTIL.isArray(v) ? i : '') + ']', v);
                });
            }
            else if (obj != null && typeof obj === 'object') {
                for (let k in obj)
                    buildParams(prefix + '[' + k + ']', obj[k]);
            }
            else {
                add(prefix, obj);
            }
        }
    }
    var CommentStripper_js_1, sprintf_js_1, documentMode, support, outputDebugConsole, UTIL;
    return {
        setters: [
            function (CommentStripper_js_1_1) {
                CommentStripper_js_1 = CommentStripper_js_1_1;
            },
            function (sprintf_js_1_1) {
                sprintf_js_1 = sprintf_js_1_1;
            }
        ],
        execute: function () {
            documentMode = window.documentMode;
            exports_4("support", support = {
                addEventListener: !!document.addEventListener,
                argumentsSlice: !(documentMode && documentMode <= 8),
                cors: 'withCredentials' in new XMLHttpRequest()
            });
            exports_4("outputDebugConsole", outputDebugConsole = logList => {
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
            });
            exports_4("UTIL", UTIL = {
                CommentStripper,
                support,
                sprintf,
                param,
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
                    const container = document.createElement('div');
                    container.innerHTML = htmlString;
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
                                    catch (e) { }
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
            });
            (function (global, console) {
                const fn = new Function();
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
            })(this || window, (this || window).console || {});
        }
    };
});
System.register("ajst/tplCompiler", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var tplCompiler, regexp_remove_ws, replace_remove_ws, regexp_escape, replace_escape, regexp_compile, replace_compile;
    return {
        setters: [],
        execute: function () {
            exports_5("tplCompiler", tplCompiler = (tplString, option) => {
                if (tplString === undefined)
                    throw new Error('AJST tplCompiler tplString undefined.');
                const args = `$id, data, option, ${Object.keys(option.global).join(', ')}`;
                const fn = `
var print          = function(){ _s += Array.prototype.join.call(arguments, ''); };
var printf         = function(){ _s += sprintf.apply(this, arguments); };
var uid            = util.makeUID('template');
var sprintf        = util.sprintf;
var _promises      = [];
var includeExecute = function(){
    var uid     = util.makeUID('include');
    var syncOut = undefined;
    var args    = util.toArray(arguments);
    util.extend(args, {2:{global:{$parent:$id},_log:option._log}});
    _s += uid;
    _promises.push(
        this.apply(this, args).then(function(output){
            syncOut = output;
            _s = _s.replace(uid, output);
        })
    );
    return syncOut !== undefined ? syncOut : uid;
};
var include = function(){
    return includeExecute.apply(AJSTget, arguments);
};
var includeAjax = function(){
    return includeExecute.apply(AJSTajax, arguments);
};
var includeEach = function(id, data, option){
    return includeExecute.apply(AJSTeach, arguments);
};
var _s = '${tplString.replace(regexp_remove_ws, replace_remove_ws).replace(regexp_compile, replace_compile).replace(regexp_escape, replace_escape)}';
return Promise.all(_promises).then(function(){
    return _s;
});`;
                try {
                    const compiler = new Function(args, fn);
                    return compiler;
                }
                catch (e) {
                    if (option.debug) {
                        console.log('AJST tplCompiler Debug');
                        console.log(e.message);
                        console.log('tplString :', tplString);
                        console.log('option :', option);
                        console.log('args: ', args);
                        console.log('fn: ', fn);
                    }
                    throw e;
                }
            });
            regexp_remove_ws = /(?:<\?([\s\S]+?)\?>)/g;
            replace_remove_ws = s => s
                .split('\n')
                .join(' ')
                .replace(/'/g, '_ESCAPE__1_')
                .replace(/"/g, '_ESCAPE__2_')
                .replace(/\\n/g, '_ESCAPE__NEWLINE_');
            regexp_escape = /_ESCAPE__1_|_ESCAPE__2_|{{script}}|{{\/script}}|_ESCAPE__NEWLINE_/g;
            replace_escape = s => {
                return {
                    _ESCAPE__1_: '\'',
                    _ESCAPE__2_: '"',
                    '{{script}}': '<script>',
                    '{{/script}}': '</script>',
                    _ESCAPE__NEWLINE_: '\\n'
                }[s] || s;
            };
            regexp_compile = /([\s'\\])(?![^\?]*\?>)|(?:<\?(=)([\s\S]+?)\?>)|(<\?)|(\?>)/g;
            replace_compile = (s, p1, p2, p3, p4, p5) => {
                if (p1)
                    return {
                        '\n': '\\n',
                        '\r': '\\r',
                        '\t': '\\t',
                        ' ': ' '
                    }[s] || '\\' + s;
                if (p2)
                    return `'+(${p3})+'`;
                if (p4)
                    return `';\n`;
                if (p5)
                    return `;\n_s+='`;
            };
        }
    };
});
System.register("ajst/template", ["ajst/tplCompiler", "ajst/lib/CommentStripper"], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var tplCompiler_1, CommentStripper_1, tplCache, ajaxCache, compileCache, getTemplateFromURL, getTemplate, setTemplate, getCompiler, setTemplateElement;
    return {
        setters: [
            function (tplCompiler_1_1) {
                tplCompiler_1 = tplCompiler_1_1;
            },
            function (CommentStripper_1_1) {
                CommentStripper_1 = CommentStripper_1_1;
            }
        ],
        execute: function () {
            tplCache = {};
            ajaxCache = {};
            compileCache = {};
            exports_6("getTemplateFromURL", getTemplateFromURL = (id, getAjax) => ajaxCache[id] = ajaxCache[id] || getAjax());
            exports_6("getTemplate", getTemplate = (id) => tplCache[id]);
            exports_6("setTemplate", setTemplate = (id, tplString) => {
                const trimed = CommentStripper_1.CommentStripper.strip(tplString.trim());
                tplCache[id] = id.match(/\.js$/) ? `<? ${trimed} ?>` : trimed;
                delete compileCache[id];
            });
            exports_6("getCompiler", getCompiler = (id, option = {}) => compileCache[id] = compileCache[id] || tplCompiler_1.tplCompiler(getTemplate(id), option));
            exports_6("setTemplateElement", setTemplateElement = (element) => {
                if (!element.id || element.tagName !== 'SCRIPT')
                    return false;
                setTemplate(element.id, element.innerHTML.replace(/<!--\?/g, '<?').replace(/\?-->/g, '?>'));
                return true;
            });
        }
    };
});
System.register("ajst/option", ["ajst/lib/UTIL"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var UTIL_1, DEFAULT_OPTION, CONST_OPTION, option;
    return {
        setters: [
            function (UTIL_1_1) {
                UTIL_1 = UTIL_1_1;
            }
        ],
        execute: function () {
            exports_7("DEFAULT_OPTION", DEFAULT_OPTION = {
                path: '$id',
                url: undefined,
                ajaxType: 'get',
                ajaxCache: true,
                ajaxData: {},
                autocollect: true,
                override: {}
            });
            exports_7("CONST_OPTION", CONST_OPTION = {});
            exports_7("option", option = (newOption) => {
                if (!newOption)
                    return UTIL_1.UTIL.extend({}, DEFAULT_OPTION);
                if (UTIL_1.UTIL.isPlainObject(newOption))
                    UTIL_1.UTIL.extend(DEFAULT_OPTION, newOption, CONST_OPTION);
                return true;
            });
        }
    };
});
System.register("ajst/prepare", ["ajst/template", "ajst/lib/UTIL", "ajst/option"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var template_1, UTIL_2, option_1, prepare;
    return {
        setters: [
            function (template_1_1) {
                template_1 = template_1_1;
            },
            function (UTIL_2_1) {
                UTIL_2 = UTIL_2_1;
            },
            function (option_1_1) {
                option_1 = option_1_1;
            }
        ],
        execute: function () {
            exports_8("prepare", prepare = (id, option = {}) => __awaiter(this, void 0, void 0, function* () {
                const opt = UTIL_2.UTIL.extend({}, option_1.DEFAULT_OPTION, option);
                let url = typeof opt.url === 'function' ? opt.url(id, option) : opt.url;
                url = url || (opt.path || '').replace(/\$id/g, id);
                if (template_1.getTemplate(id))
                    return template_1.getCompiler(id, opt);
                const fromURL = () => UTIL_2.UTIL.ajax({
                    type: opt.ajaxType,
                    cache: opt.ajaxCache,
                    data: opt.ajaxData,
                    url: url,
                    dataType: 'text'
                }).catch(e => {
                    throw new Error(`AJST prepare failed : file not found (ID: ${id}, URL: ${url})`);
                });
                const strTemplate = yield template_1.getTemplateFromURL(url, fromURL);
                const allTemplate = UTIL_2.UTIL.parseHTML(strTemplate);
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
            }));
        }
    };
});
System.register("ajst/core", ["ajst/lib/UTIL", "ajst/prepare", "ajst/option"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var UTIL_3, prepare_1, option_2, outputDebugConsole, get, ajax, each, noConflict, _oldAJST;
    return {
        setters: [
            function (UTIL_3_1) {
                UTIL_3 = UTIL_3_1;
            },
            function (prepare_1_1) {
                prepare_1 = prepare_1_1;
            },
            function (option_2_1) {
                option_2 = option_2_1;
            }
        ],
        execute: function () {
            outputDebugConsole = UTIL_3.UTIL.outputDebugConsole;
            exports_9("get", get = (id, data, option) => __awaiter(this, void 0, void 0, function* () {
                try {
                    option = option || {};
                    const curLogs = [];
                    const parentLogs = option['_log'] || [];
                    const opt = UTIL_3.UTIL.extend({}, option_2.DEFAULT_OPTION, option);
                    curLogs['id'] = id;
                    curLogs['now'] = new Date();
                    curLogs['isRoot'] = !opt.global.$parent;
                    const outputDebug = !!(curLogs['isRoot'] && opt.debug);
                    parentLogs.push(curLogs);
                    opt._log = curLogs;
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
            }));
            exports_9("ajax", ajax = (id, url, option) => get(id, UTIL_3.UTIL.ajax({
                url,
                dataType: 'json'
            }), option));
            exports_9("each", each = function (id, data, option) {
                return __awaiter(this, void 0, void 0, function* () {
                    const list = yield data;
                    const dataPromise = [];
                    UTIL_3.UTIL.each(list, v => dataPromise.push(get(id, v, option)));
                    if (!dataPromise.length)
                        return '';
                    return (yield Promise.all(dataPromise)).join('');
                });
            });
            exports_9("noConflict", noConflict = () => window['AJST'] = _oldAJST);
            _oldAJST = window['AJST'];
            option_2.CONST_OPTION.global = {};
            option_2.CONST_OPTION.global.AJSTget = get;
            option_2.CONST_OPTION.global.AJSTajax = ajax;
            option_2.CONST_OPTION.global.AJSTeach = each;
            option_2.CONST_OPTION.global.util = UTIL_3.UTIL;
            UTIL_3.UTIL.extend(option_2.DEFAULT_OPTION, option_2.CONST_OPTION);
        }
    };
});
System.register("ajst/autocollect", ["ajst/core", "ajst/option", "ajst/lib/UTIL", "ajst/template"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var core_1, option_3, UTIL_4, template_2, autocollect, resolveElement;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (option_3_1) {
                option_3 = option_3_1;
            },
            function (UTIL_4_1) {
                UTIL_4 = UTIL_4_1;
            },
            function (template_2_1) {
                template_2 = template_2_1;
            }
        ],
        execute: function () {
            exports_10("autocollect", autocollect = () => {
                if (!option_3.DEFAULT_OPTION.autocollect)
                    return;
                Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), template_2.setTemplateElement);
                Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), resolveElement);
            });
            resolveElement = (element) => __awaiter(this, void 0, void 0, function* () {
                if (!element.getAttribute('data-ajst'))
                    return UTIL_4.UTIL.removeElement(element);
                const ajaxURL = element.getAttribute('data-ajst-ajax');
                const data = element.getAttribute('data-ajst-data') ? JSON.parse(element.getAttribute('data-ajst-data')) : undefined;
                const option = element.getAttribute('data-ajst-option') ? JSON.parse(element.getAttribute('data-ajst-option')) : undefined;
                const tplOutput = yield (ajaxURL ? core_1.ajax(element.id, ajaxURL, option) : core_1.get(element.id, data, option));
                const tplElementList = UTIL_4.UTIL.parseHTML(tplOutput);
                UTIL_4.UTIL.toArray(tplElementList).forEach(function (tplElement) {
                    element.parentNode.insertBefore(tplElement, element);
                });
                UTIL_4.UTIL.removeElement(element);
            });
            if (UTIL_4.support.addEventListener)
                document.addEventListener('DOMContentLoaded', autocollect, false);
            else
                document['attachEvent']('onreadystatechange', autocollect);
        }
    };
});
System.register("ajst", ["ajst/autocollect", "ajst/core", "ajst/option", "ajst/prepare", "ajst/template", "ajst/tplCompiler"], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_11(exports);
    }
    return {
        setters: [
            function (autocollect_1_1) {
                exportStar_1(autocollect_1_1);
            },
            function (core_2_1) {
                exportStar_1(core_2_1);
            },
            function (option_4_1) {
                exportStar_1(option_4_1);
            },
            function (prepare_2_1) {
                exportStar_1(prepare_2_1);
            },
            function (template_3_1) {
                exportStar_1(template_3_1);
            },
            function (tplCompiler_2_1) {
                exportStar_1(tplCompiler_2_1);
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=ajst.commonjs.js.map
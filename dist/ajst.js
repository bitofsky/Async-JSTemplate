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
define("ajst/ns", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("ajst/lib/CommentStripper", ["require", "exports"], function (require, exports) {
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
define("ajst/lib/sprintf", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sprintf() {
        var i = 0;
        var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
        var a = arguments, format = a[i++];
        var pad = function (str, len, chr, leftJustify) {
            if (!chr)
                chr = ' ';
            var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;
        };
        var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            var diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad)
                    value = pad(value, minWidth, customPadChar, leftJustify);
                else
                    value = value.slice(0, prefix.length) + pad('', diff, '0', true) + value.slice(prefix.length);
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
            if (precision != null) {
                value = value.slice(0, precision);
            }
            return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
        };
        var doFormat = function (substring, valueIndex, flags, minWidth, _, precision, type) {
            var number, prefix, method, textTransform, value, leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, customPadChar = ' ', flagsl = flags.length;
            if (substring === '%%')
                return '%';
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
    exports.sprintf = sprintf;
});
define("ajst/lib/UTIL", ["require", "exports", "ajst/lib/CommentStripper", "ajst/lib/sprintf"], function (require, exports, CommentStripper_js_1, sprintf_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var documentMode = window.documentMode;
    exports.support = {
        addEventListener: !!document.addEventListener,
        argumentsSlice: !(documentMode && documentMode <= 8),
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
            element.parentNode && element.parentNode.removeChild(element);
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
            container.innerHTML = htmlString;
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
        for (var prefix in a) {
            buildParams(prefix, a[prefix]);
        }
        return s.join('&').replace(/%20/g, '+');
        function add(key, value) {
            value = exports.UTIL.isFunction(value) ? value() : value;
            s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        }
        function buildParams(prefix, obj) {
            if (exports.UTIL.isArray(obj)) {
                obj.forEach(function (v, i) {
                    buildParams(prefix + '[' + (typeof v === 'object' || exports.UTIL.isArray(v) ? i : '') + ']', v);
                });
            }
            else if (obj != null && typeof obj === 'object') {
                for (var k in obj)
                    buildParams(prefix + '[' + k + ']', obj[k]);
            }
            else {
                add(prefix, obj);
            }
        }
    }
    (function (global, console) {
        var fn = new Function();
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
    })(this || window, (this || window).console || {});
});
define("ajst/tplCompiler", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tplCompiler = function (tplString, option) {
        if (tplString === undefined)
            throw new Error('AJST tplCompiler tplString undefined.');
        var args = "$id, data, option, " + Object.keys(option.global).join(', ');
        var fn = "\nvar print          = function(){ _s += Array.prototype.join.call(arguments, ''); };\nvar printf         = function(){ _s += sprintf.apply(this, arguments); };\nvar uid            = util.makeUID('template');\nvar sprintf        = util.sprintf;\nvar _promises      = [];\nvar includeExecute = function(){\n    var uid     = util.makeUID('include');\n    var syncOut = undefined;\n    var args    = util.toArray(arguments);\n    util.extend(args, {2:{global:{$parent:$id},_log:option._log}});\n    _s += uid;\n    _promises.push(\n        this.apply(this, args).then(function(output){\n            syncOut = output;\n            _s = _s.replace(uid, output);\n        })\n    );\n    return syncOut !== undefined ? syncOut : uid;\n};\nvar include = function(){\n    return includeExecute.apply(AJSTget, arguments);\n};\nvar includeAjax = function(){\n    return includeExecute.apply(AJSTajax, arguments);\n};\nvar includeEach = function(id, data, option){\n    return includeExecute.apply(AJSTeach, arguments);\n};\nvar _s = '" + tplString.replace(regexp_remove_ws, replace_remove_ws).replace(regexp_compile, replace_compile).replace(regexp_escape, replace_escape) + "';\nreturn Promise.all(_promises).then(function(){\n    return _s;\n});";
        try {
            var compiler = new Function(args, fn);
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
});
define("ajst/template", ["require", "exports", "ajst/tplCompiler", "ajst/lib/CommentStripper"], function (require, exports, tplCompiler_1, CommentStripper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tplCache = {};
    var importJsCache = {};
    var ajaxCache = {};
    var compileCache = {};
    exports.getStringFromURL = function (url, getAjax) {
        return ajaxCache[url] = ajaxCache[url] || getAjax();
    };
    exports.getTemplate = function (id) { return tplCache[id]; };
    exports.flushCaches = function () {
        tplCache = {};
        ajaxCache = {};
        compileCache = {};
        importJsCache = {};
    };
    exports.setTemplate = function (id, tplString) {
        var trimed = CommentStripper_1.CommentStripper.strip(tplString.trim());
        tplCache[id] = id.match(/\.js$/) ? "<? " + trimed + " ?>" : trimed;
        if (importJsCache[id])
            tplCache[id] += "<? " + importJsCache[id] + " ?>";
        delete compileCache[id];
    };
    exports.setImportJs = function (id, importJs) {
        importJsCache[id] = importJs;
    };
    exports.getCompiler = function (id, option) {
        if (option === void 0) { option = {}; }
        return compileCache[id] = compileCache[id] || tplCompiler_1.tplCompiler(exports.getTemplate(id), option);
    };
    exports.setTemplateElement = function (element) {
        if (!element.id || element.tagName !== 'SCRIPT')
            return false;
        exports.setTemplate(element.id, element.innerHTML);
        return true;
    };
});
define("ajst/option", ["require", "exports", "ajst/lib/UTIL"], function (require, exports, UTIL_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DEFAULT_OPTION = {
        url: '$id',
        importJs: false,
        importJsUrl: '$id.js',
        ajaxType: 'get',
        ajaxCache: true,
        ajaxData: {},
        autocollect: true,
        override: {}
    };
    exports.CONST_OPTION = {};
    exports.option = function (newOption) {
        if (!newOption)
            return UTIL_1.UTIL.extend({}, exports.DEFAULT_OPTION);
        if (UTIL_1.UTIL.isPlainObject(newOption))
            UTIL_1.UTIL.extend(exports.DEFAULT_OPTION, newOption, exports.CONST_OPTION);
        return true;
    };
});
define("ajst/prepare", ["require", "exports", "ajst/template", "ajst/lib/UTIL", "ajst/option"], function (require, exports, template_1, UTIL_2, option_1) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepare = function (id, option) {
        if (option === void 0) { option = {}; }
        return __awaiter(_this, void 0, void 0, function () {
            var opt, url, importJsUrl, fromURL, importJsFromURL, _a, strTemplate, strImportJs, allTemplate, newElements;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        opt = UTIL_2.UTIL.extend({}, option_1.DEFAULT_OPTION, option);
                        url = (typeof opt.url === 'function' ? opt.url(id, option) : opt.url) || id;
                        url = url.replace(/\$id/g, id);
                        importJsUrl = (typeof opt.importJsUrl === 'function' ? opt.importJsUrl(id, option) : opt.importJsUrl) || id;
                        importJsUrl = importJsUrl.replace(/\$id/g, id);
                        if (template_1.getTemplate(id))
                            return [2 /*return*/, template_1.getCompiler(id, opt)];
                        fromURL = function () { return UTIL_2.UTIL.ajax({
                            type: opt.ajaxType,
                            cache: opt.ajaxCache,
                            data: opt.ajaxData,
                            url: url,
                            dataType: 'text'
                        }).catch(function (e) {
                            throw new Error("AJST prepare failed : file not found (ID: " + id + ", URL: " + url + ")");
                        }); };
                        importJsFromURL = function () { return UTIL_2.UTIL.ajax({
                            type: 'get',
                            cache: opt.ajaxCache,
                            data: opt.ajaxData,
                            url: importJsUrl,
                            dataType: 'text'
                        }); };
                        return [4 /*yield*/, Promise.all([
                                template_1.getStringFromURL(url, fromURL),
                                opt.importJs ? template_1.getStringFromURL(importJsUrl, importJsFromURL) : ''
                            ])];
                    case 1:
                        _a = _b.sent(), strTemplate = _a[0], strImportJs = _a[1];
                        allTemplate = UTIL_2.UTIL.parseHTML(strTemplate);
                        newElements = [];
                        try {
                            strImportJs && template_1.setImportJs(id, strImportJs);
                            Array.prototype.forEach.call(allTemplate, function (element, idx) {
                                if (idx === 0 || !(opt.override || {})[element.id])
                                    newElements.push(element);
                            });
                            if (!newElements.filter(template_1.setTemplateElement).length)
                                template_1.setTemplate(id, strTemplate);
                            return [2 /*return*/, template_1.getCompiler(id, opt)];
                        }
                        catch (e) {
                            e.message = "AJST Prepare failed : compile (ID: " + id + ", URL: " + url + ")\n" + e.message;
                            throw e;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
});
define("ajst/core", ["require", "exports", "ajst/lib/UTIL", "ajst/prepare", "ajst/option"], function (require, exports, UTIL_3, prepare_1, option_2) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    var outputDebugConsole = UTIL_3.UTIL.outputDebugConsole;
    exports.get = function (id, data, option) { return __awaiter(_this, void 0, void 0, function () {
        var curLogs_1, parentLogs, opt_1, outputDebug, pData, pCompiler, solvedData, compiler, output, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    option = option || {};
                    curLogs_1 = [];
                    parentLogs = option['_log'] || [];
                    opt_1 = UTIL_3.UTIL.extend({}, option_2.DEFAULT_OPTION, option);
                    curLogs_1['id'] = id;
                    curLogs_1['now'] = new Date();
                    curLogs_1['isRoot'] = !opt_1.global.$parent;
                    outputDebug = !!(curLogs_1['isRoot'] && opt_1.debug);
                    parentLogs.push(curLogs_1);
                    opt_1['_log'] = curLogs_1;
                    pData = Promise.resolve(typeof data === 'function' ? data() : data).then(function (result) {
                        curLogs_1.push(['time', 'elapsed time - data', new Date()]);
                        curLogs_1.push(['log', 'data', result]);
                        return result;
                    });
                    pCompiler = prepare_1.prepare(id, opt_1).then(function (result) {
                        curLogs_1.push(['time', 'elapsed time - tpl prepare', new Date()]);
                        return result;
                    });
                    return [4 /*yield*/, pData];
                case 1:
                    solvedData = _a.sent();
                    return [4 /*yield*/, pCompiler];
                case 2:
                    compiler = _a.sent();
                    output = compiler.apply(void 0, [id, solvedData, opt_1].concat(Object.keys(opt_1.global).map(function (k) { return opt_1.global[k]; })));
                    curLogs_1.push(['time', 'elapsed time - compile success', new Date()]);
                    outputDebug && outputDebugConsole(curLogs_1);
                    return [2 /*return*/, output];
                case 3:
                    e_1 = _a.sent();
                    e_1.message = "AJST error (ID: " + id + ")\n" + e_1.message;
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    exports.ajax = function (id, url, option) { return exports.get(id, UTIL_3.UTIL.ajax({
        url: url,
        dataType: 'json'
    }), option); };
    exports.each = function (id, data, option) {
        return __awaiter(this, void 0, void 0, function () {
            var list, dataPromise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, data];
                    case 1:
                        list = _a.sent();
                        dataPromise = [];
                        UTIL_3.UTIL.each(list, function (v) { return dataPromise.push(exports.get(id, v, option)); });
                        if (!dataPromise.length)
                            return [2 /*return*/, ''];
                        return [4 /*yield*/, Promise.all(dataPromise)];
                    case 2: return [2 /*return*/, (_a.sent()).join('')];
                }
            });
        });
    };
    exports.noConflict = function () { return window['AJST'] = _oldAJST; };
    var _oldAJST = window['AJST'];
    option_2.CONST_OPTION.global = {};
    option_2.CONST_OPTION.global.AJSTget = exports.get;
    option_2.CONST_OPTION.global.AJSTajax = exports.ajax;
    option_2.CONST_OPTION.global.AJSTeach = exports.each;
    option_2.CONST_OPTION.global.util = UTIL_3.UTIL;
    UTIL_3.UTIL.extend(option_2.DEFAULT_OPTION, option_2.CONST_OPTION);
});
define("ajst/autocollect", ["require", "exports", "ajst/core", "ajst/option", "ajst/lib/UTIL", "ajst/template"], function (require, exports, core_1, option_3, UTIL_4, template_2) {
    "use strict";
    var _this = this;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.autocollect = function () {
        if (!option_3.DEFAULT_OPTION.autocollect)
            return;
        Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), template_2.setTemplateElement);
        Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), resolveElement);
    };
    var resolveElement = function (element) { return __awaiter(_this, void 0, void 0, function () {
        var ajaxURL, data, option, tplOutput, tplElementList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!element.getAttribute('data-ajst'))
                        return [2 /*return*/, UTIL_4.UTIL.removeElement(element)];
                    ajaxURL = element.getAttribute('data-ajst-ajax');
                    data = element.getAttribute('data-ajst-data') ? JSON.parse(element.getAttribute('data-ajst-data') || '') : undefined;
                    option = element.getAttribute('data-ajst-option') ? JSON.parse(element.getAttribute('data-ajst-option') || '') : undefined;
                    return [4 /*yield*/, (ajaxURL ? core_1.ajax(element.id, ajaxURL, option) : core_1.get(element.id, data, option))];
                case 1:
                    tplOutput = _a.sent();
                    tplElementList = UTIL_4.UTIL.parseHTML(tplOutput);
                    UTIL_4.UTIL.toArray(tplElementList).forEach(function (tplElement) {
                        element.parentNode && element.parentNode.insertBefore(tplElement, element);
                    });
                    UTIL_4.UTIL.removeElement(element);
                    return [2 /*return*/];
            }
        });
    }); };
    if (UTIL_4.support.addEventListener)
        document.addEventListener('DOMContentLoaded', exports.autocollect, false);
    else
        document['attachEvent']('onreadystatechange', exports.autocollect);
});
define("ajst", ["require", "exports", "ajst/autocollect", "ajst/core", "ajst/option", "ajst/prepare", "ajst/template", "ajst/tplCompiler"], function (require, exports, autocollect_1, core_2, option_4, prepare_2, template_3, tplCompiler_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(autocollect_1);
    __export(core_2);
    __export(option_4);
    __export(prepare_2);
    __export(template_3);
    __export(tplCompiler_2);
});
//# sourceMappingURL=ajst.js.map
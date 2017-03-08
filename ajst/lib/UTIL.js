"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CommentStripper_js_1 = require("./CommentStripper.js");
const sprintf_js_1 = require("./sprintf.js");
const documentMode = window.documentMode;
exports.support = {
    addEventListener: !!document.addEventListener,
    argumentsSlice: !(documentMode && documentMode <= 8),
    cors: 'withCredentials' in new XMLHttpRequest()
};
exports.outputDebugConsole = (logList) => {
    const id = logList.id, now = logList.now, isRoot = logList.isRoot;
    console[isRoot ? 'groupCollapsed' : 'group'].call(console, 'AJST TPL -', id);
    logList.forEach((log) => {
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
    param,
    outputDebugConsole: exports.outputDebugConsole,
    each: function (o, eachFunction) {
        if (exports.UTIL.isArray(o))
            o.forEach(eachFunction);
        else if (exports.UTIL.isPlainObject(o))
            Object.keys(o).forEach(function (key) {
                eachFunction(o[key], key, o);
            });
        else if (o && o.length) {
            for (let i = 0, len = o.length; i < len; i++)
                eachFunction(o[i], i, o);
        }
    },
    toArray: function (o) {
        if (!exports.support.argumentsSlice) {
            const ret = [];
            exports.UTIL.each(o, function (x) {
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
        const ctor = typeof o.constructor === 'function' && o.constructor.prototype;
        if (!ctor || !Object.hasOwnProperty.call(ctor, 'isPrototypeOf'))
            return false;
        let key;
        for (key in o) { }
        return key === undefined || Object.hasOwnProperty.call(o, key);
    },
    removeElement: function (element) {
        element.parentNode && element.parentNode.removeChild(element);
    },
    extend: function (o, ...args) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source) {
            if (source) {
                for (let prop in source) {
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
        const container = document.createElement('div');
        container.innerHTML = htmlString;
        return container.childNodes;
    },
    parseXML: function (xmlString) {
        return (new DOMParser()).parseFromString(xmlString, 'application/xml');
    },
    ajax: function (option) {
        return new Promise(function (resolve, reject) {
            const opt = exports.UTIL.extend({
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
                let body = exports.UTIL.isPlainObject(opt.data) ? exports.UTIL.param(opt.data) : opt.data;
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
    const s = [];
    for (let prefix in a) {
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
            for (let k in obj)
                buildParams(prefix + '[' + k + ']', obj[k]);
        }
        else {
            add(prefix, obj);
        }
    }
}
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
//# sourceMappingURL=UTIL.js.map
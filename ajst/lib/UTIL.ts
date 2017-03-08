import { CommentStripper } from './CommentStripper.js';
import { sprintf } from './sprintf.js';

declare var XDomainRequest: any;
declare var ActiveXObject: any;

const documentMode: number = (<any>window).documentMode;

export const support = {
    addEventListener: !!document.addEventListener,
    argumentsSlice: !(documentMode && documentMode <= 8),
    cors: 'withCredentials' in new XMLHttpRequest()
};

export const outputDebugConsole = (logList: any) => {

    const id = logList.id, now = logList.now, isRoot = logList.isRoot;

    console[isRoot ? 'groupCollapsed' : 'group'].call(console, 'AJST TPL -', id);

    logList.forEach((log: any) => {

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
    CommentStripper,
    support,
    sprintf,
    param,
    outputDebugConsole,
    each: function (o: any, eachFunction: (v: any, key: string | number, o: any) => void) {
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
    toArray: function (o: any) {
        if (!support.argumentsSlice) {
            const ret: any[] = [];
            UTIL.each(o, function (x) {
                ret.push(x);
            });
            return ret;
        }
        else
            return Array.prototype.slice.call(o);
    },
    tag_escape: function (s: string) {
        return s.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#039;').replace(/"/g, '&quot;');
    },
    tag_unescape: function (s: string) {
        return s.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#0*39;/g, '\'').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    },
    makeUID: function (prefix?: string) {
        return (prefix || '') + (+(new Date())) + UTIL.randomFromTo(0, 9999999999);
    },
    randomFromTo: function (from: number, to: number) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    },
    isFunction: function (o: any) {
        return typeof o === 'function';
    },
    isArray: function (o: any) {
        return o && o.constructor === Array;
    },
    isPlainObject: function (o: any) {
        if (!o || typeof o !== 'object' || String(o) !== '[object Object]')
            return false;
        const ctor = typeof o.constructor === 'function' && o.constructor.prototype;
        if (!ctor || !Object.hasOwnProperty.call(ctor, 'isPrototypeOf'))
            return false;
        let key;
        for (key in o) { }
        return key === undefined || Object.hasOwnProperty.call(o, key);
    },
    removeElement: function (element: Element) {
        element.parentNode && element.parentNode.removeChild(element);
    },
    extend: function (o: {}, ...args: any[]) {
        Array.prototype.slice.call(arguments, 1).forEach(function (source: any) {
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
    parseHTML: function (htmlString: string) {

        const container = document.createElement('div');
        container.innerHTML = htmlString;
        return container.childNodes;

    },
    parseXML: function (xmlString: string) {
        return (new DOMParser()).parseFromString(xmlString, 'application/xml');
    },
    ajax: function (option: object) {
        return new Promise(function (resolve, reject) {

            const opt: any = UTIL.extend({
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

                let xhr: any;

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

            function sendRequest(xhr: any) {

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

            function parseDataType(source: string) {

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

function param(a: any) {

    const s: string[] = [];

    // If traditional, encode the "old" way (the way 1.3.2 or older
    // did it), otherwise encode params recursively.
    for (let prefix in a) {
        buildParams(prefix, a[prefix]);
    }

    // Return the resulting serialization
    return s.join('&').replace(/%20/g, '+');

    function add(key: any, value: any) {
        // If value is a function, invoke it and return its value
        value = UTIL.isFunction(value) ? value() : value;
        s[s.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }

    function buildParams(prefix: any, obj: any) {
        if (UTIL.isArray(obj)) {
            // Serialize array item.
            obj.forEach(function (v: any, i: any) {

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
    console.time = console.time || function (name: string, reset: any) {
        if (!name || (!reset && console.timeCounters[name]))
            return;
        console.timeCounters[name] = +(new Date());
    };
    console.timeEnd = console.timeEnd || function (name: string) {
        if (!console.timeCounters[name])
            return;
        const diff = +(new Date()) - console.timeCounters[name];
        console.info(name + ': ' + diff + 'ms');
        delete console.timeCounters[name];
        return diff;
    };

})(this || window, (this || window).console || {});

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
 * @version 1.2
 */

"use strict";

(function (global) {

    var _oldAJST = global.AJST;

    var console = global.console = global.console || {};

    var support = {
        addEventListener: !!document.addEventListener,
        argumentsSlice: !(document.documentMode && document.documentMode <= 8),
        uglyInnerHTML: document.documentMode && document.documentMode <= 8,
        cors: 'withCredentials' in new XMLHttpRequest()
    };

    /**
     * AJST Utils
     * @private
     * @type Object
     */
    var UTIL = {
        support: support,
        sprintf: sprintf,
        param: param,
        each: function (o, eachFunction) {
            if (UTIL.isArray(o))
                o.forEach(eachFunction);
            else if (UTIL.isPlainObject(o))
                Object.keys(o).forEach(function (key) {
                    eachFunction(o[key], key, o);
                });
            else if (o && o.length) {
                for (var i = 0, len = o.length; i < len; i++)
                    eachFunction(o[i], i, o);
            }
        },
        toArray: function (o) {
            if (!support.argumentsSlice) {
                var ret = [];
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
            return s.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#0*39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
        },
        makeUID: function (prefix) {
            return (prefix || '') + (+(new Date())) + UTIL.randomFromTo(0, 9999999999);
        },
        randomFromTo: function (from, to) {
            return Math.floor(Math.random() * (to - from + 1) + from);
        },
        isFunction: function (o) {
            return typeof o == 'function';
        },
        isArray: function (o) {
            return o && o.constructor === Array;
        },
        isPlainObject: function (o) {
            if (!o || typeof o != 'object' || String(o) != '[object Object]')
                return false;
            var ctor = typeof o.constructor == 'function' && o.constructor.prototype;
            if (!ctor || !Object.hasOwnProperty.call(ctor, 'isPrototypeOf'))
                return false;
            var key;
            for (key in o) {/**/ }
            return key === undefined || Object.hasOwnProperty.call(o, key);
        },
        removeElement: function (element) {
            element.parentNode.removeChild(element);
        },
        extend: function (o) {
            Array.prototype.slice.call(arguments, 1).forEach(function (source) {
                if (source) {
                    for (var prop in source) {
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

            var container = global.document.createElement('div');

            if (support.uglyInnerHTML) {
                container.innerHTML = '_' + htmlString;
                container.removeChild(container.firstChild);
            }
            else
                container.innerHTML = htmlString;

            container.childNodes.htmlString = htmlString;

            return container.childNodes;

        },
        parseXML: function (xmlString) {
            return (new global.DOMParser()).parseFromString(xmlString, "application/xml");
        },
        ajax: function (option) {
            return new Promise(function (resolve, reject) {

                var opt = UTIL.extend({
                    type: 'GET',
                    url: '.',
                    header: { 'Content-Type': 'text/plain; charset=utf-8' },
                    data: {},
                    dataType: 'text',
                    cache: true
                }, option);

                opt.type = opt.type.toUpperCase();

                if (opt.type == 'GET' && !opt.cache)
                    opt.data._timestamp = +(new Date());

                newXMLHttpRequest();

                function newXMLHttpRequest() {

                    var xhr;

                    if (!support.cors && opt.useCors && global.XDomainRequest) {
                        xhr = new global.XDomainRequest();
                        xhr.onload = function () {
                            xhr.readyState = 4;
                            xhr.status = 200;
                            xhr.onreadystatechange();
                        };
                    }
                    else if (global.XMLHttpRequest)
                        xhr = new global.XMLHttpRequest();
                    else if (global.ActiveXObject) {
                        try {
                            xhr = new global.ActiveXObject("Msxml2.XMLHTTP");
                        }
                        catch (e) {
                            try {
                                xhr = new global.ActiveXObject("Microsoft.XMLHTTP");
                            }
                            catch (e) {/**/ }
                        }
                    }

                    if (!xhr)
                        throw new Error("This browser does not support XMLHttpRequest.");

                    sendRequest(xhr);

                }

                function sendRequest(xhr) {

                    var body = UTIL.isPlainObject(opt.data) ? UTIL.param(opt.data) : opt.data;

                    xhr.onerror = reject;

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState != 4)
                            return;
                        else if (xhr.status >= 200 && xhr.status < 400)
                            resolve(parseDataType(xhr.responseText.replace(/\r\n/g, '\n')));
                        else if (xhr.status > 400)
                            reject(new Error('AJST Ajax error(status: ' + (xhr.status || 404) + ') - ' + opt.url));
                    };

                    if (opt.type == 'POST') {
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
                            return UTIL.parseHTML(source);
                        case 'xml':
                            return UTIL.parseXML(source);
                        case 'json':
                            return global.JSON.parse(source);
                    }

                    return source || '';

                }

            });

        }
    };

    function duplicate() {

        /**
         * Template String Cache
         * @private
         * @type Object
         */
        var tplCache = {};

        var ajaxCache = {};

        /**
         * Template Compiler Cache
         * @private
         * @type Object
         */
        var compileCache = {};

        var outputDebugConsole = function (logList) {

            var id = logList.id, now = logList.now, isRoot = logList.isRoot;

            console[isRoot ? 'groupCollapsed' : 'group']('AJST TPL -', id);

            logList.forEach(function (log) {

                if (log.id && log.now)
                    return outputDebugConsole(log);
                else if (log[0] == 'time')
                    console.log(log[1], log[2] - now + 'ms');
                else
                    console[log[0]].apply(console, log.slice(1, log.length));

            });

            console.groupEnd();

        };

        /**
         * Template Process
         * @public
         * @param {String} id Template Unique ID
         * @param {Mixed|Promise} [data] Template Data
         * @param {Object} [option]
         * @returns {Promise} compiledString
         */
        var AJST = function (id, data, option) {

            option = option || {};

            var curLogs = [], parentLogs = option._log || [], outputDebug;

            curLogs.id = id;
            curLogs.now = new Date();

            return new Promise(function (resolve, reject) {

                var opt = UTIL.extend({}, DEFAULT_OPTION, option),
                    dataPromise;

                curLogs.isRoot = !opt.global.$parent;
                outputDebug = curLogs.isRoot && opt.debug;

                parentLogs.push(curLogs);

                opt._log = curLogs;

                if (data && typeof data == 'function')
                    data = data();

                if (data && typeof data.then == 'function')
                    dataPromise = data;
                else
                    dataPromise = Promise.resolve(data);

                Promise.all([
                    AJST.prepare(id, opt).then(function (result) {
                        curLogs.push(['time', 'elapsed time - tpl prepare', new Date()]);
                        return result;
                    }),
                    dataPromise.then(function (result) {
                        curLogs.push(['time', 'elapsed time - data', new Date()]);
                        curLogs.push(['log', 'data', result]);
                        return result;
                    })
                ]).then(function (all) {

                    var compiler = all[0];
                    var data = all[1];

                    try {

                        var args = [id, data, opt];

                        UTIL.each(opt.global, function (o) {
                            args.push(o);
                        });

                        compiler.apply(this, args).then(function (output) {

                            curLogs.push(['time', 'elapsed time - compile success', new Date()]);

                            if (support.uglyInnerHTML)
                                resolve(output.replace(/\r\n/g, '\n'));
                            else
                                resolve(output);

                        }, rejected);

                    } catch (e) {

                        reject(e);

                    }

                }, rejected);

                function rejected(e) {

                    e.message = "AJST error (ID: " + id + ") -> " + e.message;

                    reject(e);

                }

            }).then(function (result) {

                if (!outputDebug) return result;

                outputDebugConsole(curLogs);

                return result;

                /*

                console.group('AJST TPL -', id);

                for (var i in _log.list) {
                    if (_log.list[i][0] == 'time')
                        console.log(_log.list[i][1], _log.list[i][2] - now + 'ms');
                    else
                        console[_log.list[i][0]].apply(console, _log.list[i].slice(1, _log.list[i].length - 1));
                }

                console.groupEnd();
                */
            });

        };

        /**
         * Preparing Template
         * @public
         * @param {String} id Template Unique ID
         * @param {Object} [option]
         * @returns {Promise} Compiler
         */
        AJST.prepare = function (id, option) {

            return new Promise(function (resolve, reject) {

                var opt = UTIL.extend({}, DEFAULT_OPTION, option),
                    url = opt.url || opt.path.replace(/\$id/g, id);

                if (typeof url == 'function')
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

                        var arr = [], cnt = 0;

                        Array.prototype.forEach.call(arrTemplate, function (element, idx) {
                            // check opt.override id set
                            if (idx == 0 || !opt.override[element.id]) arr.push(element);
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

        /**
         * return old AJST
         * @returns {Mixed} old AJST
         */
        AJST.noConflict = function () {
            global.AJST = _oldAJST;
            return AJST;
        };

        /**
         * get/set Default Option
         * @public
         * @returns {Mixed}
         * @example
         * var opt = AJST.option();                 // get Default
         * AJST.option({path: '/template/$id.tpl'}) // set option.path
         * AJST.option({util:{                      // set option.util.add
         *   add: function(a, b){ return +a + +b; }
         * }});
         */
        AJST.option = function () {
            switch (arguments.length) {
                case 0:
                    return UTIL.extend({}, DEFAULT_OPTION);
                case 1:
                    if (UTIL.isPlainObject(arguments[0]))
                        UTIL.extend(DEFAULT_OPTION, arguments[0], CONST_OPTION);
                    return true;
            }
        };

        /**
         * Remote JSON Data
         * @param {String} id
         * @param {String} url
         * @param {Option} [option]
         * @returns {Promise}
         */
        AJST.ajax = function (id, url, option) {

            return AJST(id, UTIL.ajax({
                url: url,
                dataType: 'json'
            }), option);

        };

        /**
         * AJST for iterable data (array or promise)
         * @param {String} id
         * @param {Array|Promise} data
         * @param {Option} option
         * @returns {Promise}
         */
        AJST.each = function (id, data, option) {

            return Promise.resolve(data).then(function (list) {

                var dataPromise = [];

                UTIL.each(list, function (v) {
                    dataPromise.push(AJST(id, v, option));
                });

                if (!dataPromise.length)
                    return '';
                else
                    return Promise.all(dataPromise).then(function (all) { return all.join(''); });

            });

        };

        /**
         * Create/Replace Template
         * @public
         * @param {String} id
         * @param {String} tplString
         * @example
         * AJST.setTemplate('Sample1', '1 + 1 = <?=1+1?>');
         * AJST('Sample1').then(function( output ){
         * // output:
         * // 1 + 1 = 2
         * });
         */
        AJST.setTemplate = function (id, tplString) {

            tplCache[id] = oCommentStripper.strip(tplString.trim());
            compileCache[id] = null;

        };

        /**
         * Set template element
         * @param {Element}
         * @return {boolean}
         */
        AJST.setTemplateElement = function (element) {
            if (!element.id || element.tagName != 'SCRIPT')
                return false;
            AJST.setTemplate(element.id, element.innerHTML.replace(/<!--\?/g, '<?').replace(/\?-->/g, '?>'));
            return true;
        };

        /**
         * Template auto collect
         */
        AJST.autocollect = function () {

            if (!DEFAULT_OPTION.autocollect)
                return;

            Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), AJST.setTemplateElement);

            Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), function (element) {

                // auto replace
                if (element.getAttribute('data-ajst')) {

                    var ajax = element.getAttribute('data-ajst-ajax'),
                        data = element.getAttribute('data-ajst-data') ? JSON.parse(element.getAttribute('data-ajst-data')) : undefined,
                        option = element.getAttribute('data-ajst-option') ? JSON.parse(element.getAttribute('data-ajst-option')) : undefined;

                    (ajax ? AJST.ajax(element.id, ajax, option) : AJST(element.id, data, option)).then(function (tplOutput) {

                        var tplElementList = UTIL.parseHTML(tplOutput);

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

        /**
         * Get Template
         * @public
         * @param {String} id
         * @returns {String|undefined}
         * @example
         * AJST.setTemplate('Sample1', '1 + 1 = <?=1+1?>');
         * AJST.getTemplate('Sample1'); // '1 + 1 = <?=1+1?>'
         */
        AJST.getTemplate = function (id) {

            return tplCache[id];

        };

        /**
         * Get Template Compiler
         * @param {String} id
         * @param {Object} [option]
         * @returns {Function}
         * @throws {type} description
         */
        AJST.getCompiler = function (id, option) {

            if (!compileCache[id]) {
                var tplString = AJST.getTemplate(id);
                if (tplString === undefined)
                    throw new Error('AJST Undefined TPL ID (ID: ' + id + ')');
                compileCache[id] = tplCompiler(tplString, option);
            }

            return compileCache[id];

        };

        AJST.Promise = Promise;

        AJST.duplicate = duplicate;

        /**
         * AJST Defulat Option
         * @private
         * @type Object
         */
        var DEFAULT_OPTION = {
            path: './tpl/$id.tpl',
            url: null,
            ajaxType: 'GET',
            ajaxCache: true,
            ajaxData: {},
            autocollect: true,
            override: {}
        },
            CONST_OPTION = {
                global: {
                    AJST: AJST,
                    util: UTIL,
                    Promise: Promise
                }
            };

        UTIL.extend(DEFAULT_OPTION, CONST_OPTION);

        return AJST;

    }

    /**
     * Create Template Compiler
     * @private
     * @param {String} str Template String
     * @param {Object} [option]
     * @returns {Function} ( $id[, data][,option.global.firstKey][,option.global.secondKey] .. )
     */
    var tplCompiler = function (str, option) {

        var args = '$id, data, option, ' + Object.keys(option.global).join(', '),
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

            return new Function(args, fn);

        } catch (e) {

            if (option.debug) {
                console.debug('AJST tplCompiler Debug');
                console.debug(e.message);
                console.debug('template :', str);
                console.debug('option :', option);
                console.debug('args: ', args);
                console.debug('fn: ', fn);
            }

            throw e;

        }

    };

    var regexp_remove_ws = /(?:<\?([\s\S]+?)\?>)/g,
        replace_remove_ws = function (s) {
            return s.split('\n').join(' ').replace(/'/g, '_ESCAPE__1_').replace(/"/g, '_ESCAPE__2_').replace(/\\n/g, '_ESCAPE__NEWLINE_');
        },
        regexp_escape = /_ESCAPE__1_|_ESCAPE__2_|{{script}}|{{\/script}}|_ESCAPE__NEWLINE_/g,
        replace_escape = function (s) {
            return {
                _ESCAPE__1_: "'",
                _ESCAPE__2_: '"',
                '{{script}}': '<script>',
                '{{/script}}': '</script>',
                _ESCAPE__NEWLINE_: '\\n'
            }[s] || s;
        },
        regexp_compile = /([\s'\\])(?![^\?]*\?>)|(?:<\?(=)([\s\S]+?)\?>)|(<\?)|(\?>)/g,
        replace_compile = function (s, p1, p2, p3, p4, p5) {

            if (p1) { // whitespace, quote and backslash in interpolation context
                return {
                    "\n": "\\n",
                    "\r": "\\r",
                    "\t": "\\t",
                    " ": " "
                }[s] || "\\" + s;
            }
            if (p2) { // interpolation: <?=prop?>
                return "'+(" + p3 + ")+'";
            }
            if (p4) { // evaluation start tag: <?
                return "';\n";
            }
            if (p5) { // evaluation end tag: ?>
                return ";\n_s+='";
            }
        };

    var CommentStripper = function () { var i = "/", r = "\\", n = "*", e = '"', s = "'", h = "\n", o = "\r", u = function () { }; return u.prototype = { string: "", length: 0, position: 0, output: null, getCurrentCharacter: function () { return this.string.charAt(this.position); }, getPreviousCharacter: function () { return this.string.charAt(this.position - 1); }, getNextCharacter: function () { return this.string.charAt(this.position + 1); }, add: function () { this.output.push(this.getCurrentCharacter()); }, next: function () { this.position++; }, atEnd: function () { return this.position >= this.length; }, isEscaping: function () { if (this.getPreviousCharacter() == r) { for (var t = this.position - 1, i = !1; t > 0;) { if (this.string.charAt(t--) != r) return i; i = !i; } return i; } return !1; }, processSingleQuotedString: function () { if (this.getCurrentCharacter() == s) for (this.add(), this.next(); !this.atEnd();) { if (this.getCurrentCharacter() == s && !this.isEscaping()) return; this.add(), this.next(); } }, processDoubleQuotedString: function () { if (this.getCurrentCharacter() == e) for (this.add(), this.next(); !this.atEnd();) { if (this.getCurrentCharacter() == e && !this.isEscaping()) return; this.add(), this.next(); } }, processSingleLineComment: function () { if (this.getCurrentCharacter() == i && this.getNextCharacter() == i) for (this.next(); !this.atEnd();)if (this.next(), this.getCurrentCharacter() == h || this.getCurrentCharacter() == o) return; }, processMultiLineComment: function () { if (this.getCurrentCharacter() == i && this.getNextCharacter() == n) for (; !this.atEnd();)if (this.next(), this.getCurrentCharacter() == n && this.getNextCharacter() == i) return this.next(), void this.next(); }, process: function () { for (; !this.atEnd();)this.processDoubleQuotedString(), this.processSingleQuotedString(), this.processSingleLineComment(), this.processMultiLineComment(), this.atEnd() || (this.add(), this.next()); }, reset: function () { this.string = "", this.length = 0, this.position = 0, this.output = []; }, strip: function (t) { return this.reset(), this.string = t, this.length = this.string.length, this.process(), this.output.join(""); } }, "function" == typeof define && define("commentstripper", [], function () { return u; }), u; } ();

    var oCommentStripper = new CommentStripper();

    /**
     * Return a formatted string
     * discuss at: http://phpjs.org/functions/sprintf
     */
    function sprintf() {
        var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
        var a = arguments, i = 0, format = a[i++];
        var pad = function (str, len, chr, leftJustify) {
            if (!chr) {
                chr = ' ';
            }
            var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
            return leftJustify ? str + padding : padding + str;
        };
        var justify = function (value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
            var diff = minWidth - value.length;
            if (diff > 0) {
                if (leftJustify || !zeroPad) {
                    value = pad(value, minWidth, customPadChar, leftJustify);
                } else {
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
            if (substring == '%%') {
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
            } else if (minWidth == '*') {
                minWidth = +a[i++];
            } else if (minWidth.charAt(0) == '*') {
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
                precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type == 'd') ? 0 : undefined;
            } else if (precision == '*') {
                precision = +a[i++];
            } else if (precision.charAt(0) == '*') {
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

    function param(a) {

        var s = [];

        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for (var prefix in a) {
            buildParams(prefix, a[prefix]);
        }

        // Return the resulting serialization
        return s.join("&").replace(/%20/g, "+");

        function add(key, value) {
            // If value is a function, invoke it and return its value
            value = UTIL.isFunction(value) ? value() : value;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        }

        function buildParams(prefix, obj) {
            if (UTIL.isArray(obj)) {
                // Serialize array item.
                obj.forEach(function (v, i) {

                    buildParams(prefix + "[" + (typeof v === "object" || UTIL.isArray(v) ? i : "") + "]", v);

                });

            } else if (obj != null && typeof obj === "object") {
                // Serialize object item.
                for (var k in obj)
                    buildParams(prefix + "[" + k + "]", obj[k]);

            } else {
                // Serialize scalar item.
                add(prefix, obj);
            }
        }

    }

    var AJST = global.AJST = duplicate();

    if (support.addEventListener)
        document.addEventListener("DOMContentLoaded", AJST.autocollect, false);
    else
        document.attachEvent("onreadystatechange", AJST.autocollect);

    /**
     * For AMD require.js
     * http://requirejs.org
     */
    if (global.define && global.define.amd)
        global.define('AJST', [], function () {
            return AJST;
        });

})(this);

/**
 * Browser Compatibility
 */
(function (global, console) {

    var fn = new Function();

    var TypeError = global.TypeError;

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
        console.info(name + ": " + diff + "ms");
        delete console.timeCounters[name];
        return diff;
    };

    /**
     * IE7 document.querySelectorAll
     */
    if (!global.document.querySelectorAll) {
        (function (document) {
            var a = document.styleSheets.length ? document.styleSheets[0] : document.createStyleSheet();
            document.querySelectorAll = function (e) {
                a.addRule(e, 'f:b');
                for (var l = document.all, b = 0, c = [], f = l.length; b < f; b++)
                    l[b].currentStyle.f && c.push(l[b]);
                a.removeRule(0);
                return c;
            };
        })(global.document);
    }

})(this, this.console || {});

/**
 * AJST : Asynchronous JavaScript Templating
 *   for Web Browsers
 *
 * Inspired by
 *   John Resig's JavaScript Micro-Templating: http://ejohn.org/blog/javascript-micro-templating/
 *   blueimp's JavaScript-Templates: https://github.com/blueimp/JavaScript-Templates/
 *
 * The MIT License
 * Copyright (C) 2013 Bum-seok Hwang (bitofsky@neowiz.com)
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @author bitofsky@neowiz.com 2013.07.25
 * @encoding UTF-8
 * @version 1.0
 */

"use strict";

(function(global) {

  var _oldAJST = global.AJST;

  var console = global.console = global.console || {};

  /**
   * Template String Cache
   * @private
   * @type Object
   */
  var tplCache = {};

  /**
   * Template Compiler Cache
   * @private
   * @type Object
   */
  var compileCache = {};

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
    each: function(o, eachFunction) {
      if (UTIL.isArray(o))
        o.forEach(eachFunction);
      else if (UTIL.isPlainObject(o))
        Object.keys(o).forEach(function(key) {
          eachFunction(o[key], key, o);
        });
      else if (o && o.length) {
        for (var i = 0, len = o.length; i < len; i++)
          eachFunction(o[i], i, o);
      }
    },
    toArray: function(o) {
      if (!support.argumentsSlice) {
        var ret = [];
        UTIL.each(o, function(x) {
          ret.push(x);
        });
        return ret;
      }
      else
        return Array.prototype.slice.call(o);
    },
    tag_escape: function(s) {
      return s.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#039;').replace(/"/g, '&quot;');
    },
    tag_unescape: function(s) {
      return s.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#0*39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    },
    makeUID: function(prefix) {
      return (prefix || '') + (+(new Date())) + UTIL.randomFromTo(0, 9999999999);
    },
    randomFromTo: function(from, to) {
      return Math.floor(Math.random() * (to - from + 1) + from);
    },
    isFunction: function(o) {
      return typeof o == 'function';
    },
    isArray: function(o) {
      return o && o.constructor === Array;
    },
    isPlainObject: function(o) {
      if (!o || typeof o != 'object' || String(o) != '[object Object]')
        return false;
      var ctor = typeof o.constructor == 'function' && o.constructor.prototype;
      if (!ctor || !Object.hasOwnProperty.call(ctor, 'isPrototypeOf'))
        return false;
      var key;
      for (key in o) {
      }
      return key === undefined || Object.hasOwnProperty.call(o, key);
    },
    removeElement: function(element) {
      element.parentNode.removeChild(element);
    },
    extend: function(o) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
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
    parseHTML: function(htmlString) {

      var container = global.document.createElement('div');

      if (support.uglyInnerHTML) {
        container.innerHTML = '_' + htmlString.replace(/\r\n/g, '\n');
        container.removeChild(container.firstChild);
      }
      else
        container.innerHTML = htmlString;

      return container.childNodes;

    },
    parseXML: function(xmlString) {
      return (new global.DOMParser()).parseFromString(xmlString, "application/xml");
    },
    ajax: function(option) {

      var promise = Promise();

      var opt = UTIL.extend({
        type: 'GET',
        url: '.',
        header: {'Content-Type': 'text/plain; charset=utf-8'},
        data: {},
        dataType: 'text',
        cache: true
      }, option);

      opt.type = opt.type.toUpperCase();

      if (opt.type == 'GET' && !opt.cache)
        opt.data._timestamp = +(new Date());

      newXMLHttpRequest();

      return promise;

      function newXMLHttpRequest() {

        var xhr;

        if (!support.cors && opt.useCors && global.XDomainRequest) {
          xhr = new global.XDomainRequest();
          xhr.onload = function() {
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
            catch (e) {
            }
          }
        }

        if (!xhr)
          throw new Error("This browser does not support XMLHttpRequest.");

        sendRequest(xhr);

      }

      function sendRequest(xhr) {

        var body = UTIL.isPlainObject(opt.data) ? UTIL.param(opt.data) : opt.data;

        xhr.onerror = reject;

        xhr.onreadystatechange = function() {
          if (xhr.readyState != 4)
            return;
          else if (xhr.status >= 200 && xhr.status < 400)
            promise.resolve(parseDataType(xhr.responseText));
          else if (xhr.status > 400)
            reject();
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

        function reject() {
          promise.reject(new Error('AJST Ajax error(status: ' + (xhr.status || 404) + ') - ' + opt.url), xhr);
        }

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

    }
  };

  /**
   * Template Process
   * @public
   * @param {String} id Template Unique ID
   * @param {Mixed} [data] Template Data
   * @param {Object} [option]
   * @returns {Promise} compiledString
   */
  var AJST = global.AJST = function(id, data, option) {

    var opt = UTIL.extend({}, DEFAULT_OPTION, option),
        promise = Promise();

    if (opt.debug)
      console.time('AJST elapsed time (ID: ' + id + ')');

    AJST.prepare(id, option).then(function(compiler) {

      try {

        var args = [id, data];

        UTIL.each(opt.global, function(o) {
          args.push(o);
        });

        compiler.apply(this, args).then(function(output) {

          if (opt.debug)
            console.timeEnd('AJST elapsed time (ID: ' + id + ')');

          if (support.uglyInnerHTML)
            promise.resolve(output.replace(/\r\n/g, '\n'));
          else
            promise.resolve(output);

        }, rejected);

      } catch (e) {

        promise.reject(e);

      }

    }, rejected);

    return promise;

    function rejected(e) {

      e.message = "AJST error (ID: " + id + ") -> " + e.message;

      promise.reject(e);

    }

  };

  /**
   * Preparing Template
   * @public
   * @param {String} id Template Unique ID
   * @param {Object} [option]
   * @returns {Promise} Compiler
   */
  AJST.prepare = function(id, option) {

    var opt = UTIL.extend({}, DEFAULT_OPTION, option),
        url = opt.url || opt.path.replace(/\$id/g, id),
        promise = Promise();

    try {

      if (AJST.getTemplate(id))
        resolved();

      else
        promiseCache(url, function() {
          return UTIL.ajax({
            type: opt.ajaxType,
            cache: opt.ajaxCache,
            data: opt.ajaxData,
            url: url,
            dataType: 'html'
          }).then(function(arrTemplate) {

            Array.prototype.forEach.call(arrTemplate, AJST.setTemplateElement);

          });
        }).then(resolved, function() {
          promise.reject(new Error('AJST file not found : (ID: ' + id + ', URL: ' + url + ')'));
        });

    } catch (e) {
      promise.reject(e);
    }

    return promise;

    function resolved() {
      try {
        promise.resolve(AJST.getCompiler(id, opt));
      }
      catch (e) {
        promise.reject(e);
      }
    }

  };

  /**
   * return old AJST
   * @returns {Mixed} old AJST
   */
  AJST.noConflict = function() {
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
  AJST.option = function() {
    switch (arguments.length) {
      case 0:
        return UTIL.extend({}, DEFAULT_OPTION);
      case 1:
        if (UTIL.isPlainObject(arguments[0]))
          UTIL.extend(DEFAULT_OPTION, arguments[0]);
        return true;
    }
  };

  /**
   * Remote JSON Data
   * @param {String} id
   * @param {String} url JSON data location
   * @param {Option} [option]
   * @returns {Promise}
   */
  AJST.ajax = function(id, url, option) {

    var promise = Promise();

    UTIL.ajax({
      url: url,
      dataType: 'json'
    }).then(function(data) {

      AJST(id, data, option).then(promise.resolve, promise.reject);

    }, function(x) {
      console.debug(x);
      promise.reject(x);
    });

    return promise;

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
  AJST.setTemplate = function(id, tplString) {

    tplCache[id] = tplString.trim();
    compileCache[id] = null;

  };

  /**
   * Template string is extracted from the element.
   * @param {Element} element Attribute ID is required. element.ID is used as the template ID.
   */
  AJST.setTemplateElement = function(element) {
    if (!element.id)
      return;
    AJST.setTemplate(element.id, element.innerHTML.replace(/<!--\?/g, '<?').replace(/\?-->/g, '?>'));
  };

  /**
   * In the document, template is automatically collected.
   */
  AJST.autocollect = function() {

    if (!DEFAULT_OPTION.autocollect)
      return;

    Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), AJST.setTemplateElement);

    Array.prototype.forEach.call(document.querySelectorAll('SCRIPT[id]'), function(element) {

      // auto replace
      if (element.getAttribute('data-ajst')) {

        var ajax = element.getAttribute('data-ajst-ajax'),
            data = element.getAttribute('data-ajst-data') ? JSON.parse(element.getAttribute('data-ajst-data')) : undefined,
            option = element.getAttribute('data-ajst-option') ? JSON.parse(element.getAttribute('data-ajst-option')) : undefined;

        (ajax ? AJST.ajax(element.id, ajax, option) : AJST(element.id, data, option)).then(function(tplOutput) {

          var tplElementList = UTIL.parseHTML(tplOutput);

          UTIL.toArray(tplElementList).forEach(function(tplElement) {
            element.parentNode.insertBefore(tplElement, element);
          });

          UTIL.removeElement(element);

        }, function(e) {

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
  AJST.getTemplate = function(id) {

    return tplCache[id];

  };

  /**
   * Get Template Compiler
   * @param {String} id
   * @param {Object} [option]
   * @returns {Function}
   * @throws {type} description
   */
  AJST.getCompiler = function(id, option) {

    if (!compileCache[id]) {
      var tplString = AJST.getTemplate(id);
      if (!tplString)
        throw new Error('AJST Undefined TPL ID (ID: ' + id + ')');
      compileCache[id] = tplCompiler(tplString, option);
    }

    return compileCache[id];

  };

  /**
   * Create Template Compiler
   * @private
   * @param {String} str Template String
   * @param {Object} [option]
   * @returns {Function} ( $id[, data][,option.global.firstKey][,option.global.secondKey] .. )
   */
  var tplCompiler = function(str, option) {

    var args = '$id, data, ' + Object.keys(option.global).join(', '),
        fn = '\n\
      var print     = function(){ _s += Array.prototype.join.call(arguments,""); },\n\
          printf    = function(){ _s += sprintf.apply(this, arguments); },\n\
          sprintf   = util.sprintf,\n\
          _promises = [],\n\
          include   = function(){\n\
            var uid     = util.makeUID("include");\n\
                syncOut = undefined;\n\
            _s += uid;\n\
            _promises.push(\n\
              AJST.apply(this, arguments).then(function(output){\n\
                syncOut = output;\n\
                _s = _s.replace(uid, output);\n\
              })\n\
            );\n\
            return syncOut !== undefined ? syncOut : uid;\n\
          },\n\
          includeEach = function(id, data, option){\n\
            var ret = [];\n\
            util.each(data, function(eachData, key){\n\
              ret.push(include(id, eachData, option));\n\
            });\n\
            return ret.join();\n\
          };\n\
      var _s = \'' + str.replace(regexp_remove_ws, replace_remove_ws).replace(regexp_compile, replace_compile).replace(regexp_escape, replace_escape) + '\';\n\
      return new Promise(_promises).then(function(){\n\
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
      replace_remove_ws = function(s) {
    return s.split('\n').join(' ').replace(/'/g, '_ESCAPE__1_').replace(/"/g, '_ESCAPE__2_');
  },
      regexp_escape = /_ESCAPE__1_|_ESCAPE__2_|{{script}}|{{\/script}}/g,
      replace_escape = function(s) {
    return {
      _ESCAPE__1_: "'",
      _ESCAPE__2_: '"',
      '{{script}}': '<script>',
      '{{/script}}': '</script>'
    }[s] || s;
  },
      regexp_compile = /([\s'\\])(?![^\?]*\?>)|(?:<\?(=)([\s\S]+?)\?>)|(<\?)|(\?>)/g,
      replace_compile = function(s, p1, p2, p3, p4, p5) {

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

  /**
   * Promise/A
   *
   * @author bitofsky@neowiz.com 2013.07.25
   * @returns {Promise}
   * @example
   * var p = Promise();
   * p.resolve( result );
   * p.reject( exception );
   * var when = Promise( [promise1[, promise2[, n..]]] );
   * when.then(function(){ .. }, function(){ .. });
   */
  var Promise = UTIL.Promise = AJST.Promise = (function() {

    var Promise = function() {

      var then = [],
          fail = [],
          progress = [],
          always = [],
          lastReturn = undefined;

      var _this = this;

      _this.state = 'unfulfilled';

      _this.then = function() {

        var args = arguments;

        [then, fail, progress].forEach(function(callbacks, i) {
          if (typeof args[i] == 'function')
            callbacks.push(args[i]);
        });

        if (_this.state != 'unfulfilled')
          executeAllCallbacks(_this.state == 'fulfilled' ? then : fail);

        return this;

      };

      _this.always = function() {
        Array.prototype.push.apply(always, arguments);
        if (_this.state != 'unfulfilled')
          complete(_this.state);
        return this;
      };

      _this.resolve = function() {
        complete(then, 'fulfilled', arguments);
      };

      _this.reject = function() {
        complete(fail, 'failed', arguments);
      };

      _this.notify = function() {

        // progress
        if (_this.state != 'unfulfilled')
          return;

        var args = arguments;

        progress.forEach(function(fn) {
          fn.apply(_this, args);
        });

      };

      _this.when = function() {

        if (!arguments.length)
          return;

        var promiseReturn = [],
            promises = arguments.length == 1 && arguments[0].constructor == Array ? arguments[0] : arguments,
            currentCnt = 0;

        Array.prototype.forEach.call(promises, function(promise, idx, promises) {

          promise.then(function() {

            promiseReturn[idx] = arguments[0];

            if (promises.length == ++currentCnt)
              _this.resolve.apply(_this, promiseReturn);

            return arguments[0];

          }, function() {

            _this.reject.apply(_this, arguments);

          });

        });

        if (!promises.length)
          _this.resolve();

      };

      function complete(callback, state, args) {

        if (_this.state != 'unfulfilled')
          return;

        _this.state = state;

        lastReturn = args;

        executeAllCallbacks(callback);

      }

      function executeAllCallbacks(callbacks) {

        try {

          var fn, override;

          // shift and execute
          while (typeof (fn = callbacks.shift()) == 'function') {
            override = fn.apply(_this, lastReturn);
            lastReturn = override !== undefined ? [override] : lastReturn;
          }

          while (typeof (fn = always.shift()) == 'function')
            fn.call(_this);

        }
        catch (e) {
          console.error('AJST Promise error [' + _this.state + '] ' + e.constructor.name + ': ' + e.message);
          throw e;
        }

      }

    };

    Promise.prototype.fail = function() {
      var _this = this;
      Array.prototype.forEach.call(arguments, function(callback) {
        _this.then(null, callback);
      });
      return this;
    };

    Promise.prototype.progress = function() {
      var _this = this;
      Array.forEach.call(arguments, function(callback) {
        _this.then(null, null, callback);
      });
      return this;
    };

    return function() {

      var promise = new Promise();
      if (arguments.length)
        promise.when.apply(promise, arguments);
      return promise;
    };

  })();

  /**
   * Async Promise Cache
   *
   * @author bitofsky@neowiz.com 2013.07.25
   * @param {String} name
   * @param {Function} callback
   * @return {Promise}
   */
  var promiseCache = (function() {

    var Cached = {},
        Waiting = {};

    return function(name, callback) {

      var promise = Promise();

      switch (true) {
        case !!Cached[name] : // cached arguments
          resolveCache();
          break;
        case !!Waiting[name] : // waiting
          Waiting[name].then(resolveCache, onerror);
          break;
        default : // first call
          Waiting[name] = callback().then(setNewCache, onerror).then(resolveCache);
      }

      return promise;

      function setNewCache() {
        Waiting[name] = null;
        Cached[name] = arguments;
      }

      function resolveCache() {
        promise.resolve.apply(promise, Cached[name]);
      }

      function onerror() {
        Waiting[name] = null;
        promise.reject.apply(promise, arguments);
      }

    };

  })();

  /**
   * Return a formatted string
   * discuss at: http://phpjs.org/functions/sprintf
   */
  function sprintf() {
    var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuidfegEG])/g;
    var a = arguments, i = 0, format = a[i++];
    var pad = function(str, len, chr, leftJustify) {
      if (!chr) {
        chr = ' ';
      }
      var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0).join(chr);
      return leftJustify ? str + padding : padding + str;
    };
    var justify = function(value, prefix, leftJustify, minWidth, zeroPad, customPadChar) {
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
    var formatBaseX = function(value, base, prefix, leftJustify, minWidth, precision, zeroPad) {
      var number = value >>> 0;
      prefix = prefix && number && {'2': '0b', '8': '0', '16': '0x'}[base] || '';
      value = prefix + pad(number.toString(base), precision || 0, '0', false);
      return justify(value, prefix, leftJustify, minWidth, zeroPad);
    };
    var formatString = function(value, leftJustify, minWidth, precision, zeroPad, customPadChar) {
      if (precision != null) {
        value = value.slice(0, precision);
      }
      return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
    };
    var doFormat = function(substring, valueIndex, flags, minWidth, _, precision, type) {
      var number;
      var prefix;
      var method;
      var textTransform;
      var value;
      if (substring == '%%') {
        return'%';
      }
      var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, customPadChar = ' ';
      var flagsl = flags.length;
      for (var j = 0; flags && j < flagsl; j++) {
        switch (flags.charAt(j)) {
          case' ':
            positivePrefix = ' ';
            break;
          case'+':
            positivePrefix = '+';
            break;
          case'-':
            leftJustify = true;
            break;
          case"'":
            customPadChar = flags.charAt(j + 1);
            break;
          case'0':
            zeroPad = true;
            break;
          case'#':
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
        case's':
          return formatString(String(value), leftJustify, minWidth, precision, zeroPad, customPadChar);
        case'c':
          return formatString(String.fromCharCode(+value), leftJustify, minWidth, precision, zeroPad);
        case'b':
          return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case'o':
          return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case'x':
          return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case'X':
          return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth, precision, zeroPad).toUpperCase();
        case'u':
          return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth, precision, zeroPad);
        case'i':
        case'd':
          number = (+value) | 0;
          prefix = number < 0 ? '-' : positivePrefix;
          value = prefix + pad(String(Math.abs(number)), precision, '0', false);
          return justify(value, prefix, leftJustify, minWidth, zeroPad);
        case'e':
        case'E':
        case'f':
        case'F':
        case'g':
        case'G':
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
      s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
    }

    function buildParams(prefix, obj) {
      if (UTIL.isArray(obj)) {
        // Serialize array item.
        obj.forEach(function(v, i) {

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
    global: {
      AJST: AJST,
      util: UTIL,
      Promise: Promise
    },
    autocollect: true
  };

  if (support.addEventListener)
    document.addEventListener("DOMContentLoaded", AJST.autocollect, false);
  else
    document.attachEvent("onreadystatechange", AJST.autocollect);


  /**
   * For AMD require.js
   * http://requirejs.org
   */
  if (global.define && global.define.amd)
    global.define('AJST', [], function() {
      return AJST;
    });

})(this);

/**
 * Browser Compatibility
 * @author bitofsky@neowiz.com 2013.07.25
 */
(function(global, console) {

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
  console.time = console.time || function(name, reset) {
    if (!name || (!reset && console.timeCounters[name]))
      return;
    console.timeCounters[name] = +(new Date());
  };
  console.timeEnd = console.timeEnd || function(name) {
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
    (function(document) {
      var a = document.styleSheets[0] || document.createStyleSheet();
      document.querySelectorAll = function(e) {
        a.addRule(e, 'f:b');
        for (var l = document.all, b = 0, c = [], f = l.length; b < f; b++)
          l[b].currentStyle.f && c.push(l[b]);
        a.removeRule(0);
        return c;
      };
    })(global.document);
  }

})(this, this.console || {});
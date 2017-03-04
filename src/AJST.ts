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

import UTIL from '../lib/util.js';

const global = window;
const support = UTIL.support;
const { CommentStripper, outputDebugConsole } = UTIL;

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

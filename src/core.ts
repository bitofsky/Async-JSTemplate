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
 * @version 1.5.4
 */
/// <reference path="core.d.ts" />

'use strict';

import { UTIL } from './lib/UTIL';
import { prepare } from './prepare';
import { DEFAULT_OPTION } from './option';

const { outputDebugConsole, support, CommentStripper } = UTIL;

const global = window;

const _oldAJST = global['AJST'];

/**
 * Generate AJST Template String
 */
export const AJST = async (id: string, data: any = null, option: AJST.AJSTOption = null) => {

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

        const pData = Promise.resolve(typeof data === 'function' ? data() : data).then(result => {
            curLogs.push(['time', 'elapsed time - data', new Date()]);
            curLogs.push(['log', 'data', result]);
            return result;
        });

        const pCompiler = prepare(id, opt).then(result => {
            curLogs.push(['time', 'elapsed time - tpl prepare', new Date()]);
            return result;
        });

        const solvedData = await pData;
        const compiler = await pCompiler;
        const output = compiler(id, solvedData, opt, ...Object.keys(opt.global).map(k => opt.global[k])); // generate output text

        curLogs.push(['time', 'elapsed time - compile success', new Date()]);

        outputDebug && outputDebugConsole(curLogs); // show log groups..

        return support.uglyInnerHTML ? output.replace(/\r\n/g, '\n') : output;

    }
    catch (e) {
        console.error(e);
        e.message = `AJST error (ID: ${id}) -> ${e.message}`;
        throw e; // throw next
    }
};

/**
 * Remote JSON Data
 */
export const ajax = (id: string, url: string, option: AJST.AJSTOption) => AJST(id, UTIL.ajax({
    url,
    dataType: 'json'
}), option);

/**
 * AJST for iterable data (array or promise)
 */
export const each = async function (id: string, data: any, option: AJST.AJSTOption) {

    const list = await data; // resolve promise
    const dataPromise: Promise<string>[] = [];

    UTIL.each(list, v => dataPromise.push(AJST(id, v, option)));

    if (!dataPromise.length)
        return '';

    return (await Promise.all(dataPromise)).join('');

};

/**
 * return old AJST
 */
export const noConflict = () => global['AJST'] = _oldAJST;

global['AJST'] = AJST;

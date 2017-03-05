import { ns } from '../namespace';
import { UTIL } from './lib/UTIL';
import { prepare } from './prepare';
import { DEFAULT_OPTION, CONST_OPTION } from './option';

const { outputDebugConsole, support, CommentStripper } = UTIL;

/**
 * Generate AJST Template String
 */
export const get = async (id: string, data: any = null, option: ns.AJSTOption = null) => {

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

        return output;

    }
    catch (e) {
        e.message = `AJST error (ID: ${id})\n${e.message}`;
        throw e; // throw next
    }
};

/**
 * Remote JSON Data
 */
export const ajax = (id: string, url: string, option: ns.AJSTOption) => get(id, UTIL.ajax({
    url,
    dataType: 'json'
}), option);

/**
 * AJST for iterable data (array or promise)
 */
export const each = async function (id: string, data: any, option: ns.AJSTOption) {

    const list = await data; // resolve promise
    const dataPromise: Promise<string>[] = [];

    UTIL.each(list, v => dataPromise.push(get(id, v, option)));

    if (!dataPromise.length)
        return '';

    return (await Promise.all(dataPromise)).join('');

};

/**
 * return old AJST
 */
export const noConflict = () => window['AJST'] = _oldAJST;

const _oldAJST = window['AJST'];

// constant default option.global
CONST_OPTION.global = {};
CONST_OPTION.global.AJSTget = get;
CONST_OPTION.global.AJSTajax = ajax;
CONST_OPTION.global.AJSTeach = each;
CONST_OPTION.global.util = UTIL;

// option mixing
UTIL.extend(DEFAULT_OPTION, CONST_OPTION);

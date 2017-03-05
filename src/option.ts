import { UTIL } from './lib/UTIL';

/**
 * Default Option
 */
export const DEFAULT_OPTION: AJST.AJSTOption = {
    path: './tpl/$id',
    url: null,
    ajaxType: 'GET',
    ajaxCache: true,
    ajaxData: {},
    autocollect: true,
    override: {}
};

/**
 * Constant Option
 */
export const CONST_OPTION: AJST.AJSTOption = {};

/**
 * get/set Default Option
 * @example
 * var opt = AJST.option();                 // get Default
 * AJST.option({path: '/template/$id.tpl'}) // set option.path
 * AJST.option({util:{                      // set option.util.add
 *   add: function(a, b){ return +a + +b; }
 * }});
 */
export const option = (newOption?: AJST.AJSTOption): AJST.AJSTOption | boolean => {
    if (!newOption)
        return UTIL.extend({}, DEFAULT_OPTION);
    if (UTIL.isPlainObject(newOption))
        UTIL.extend(DEFAULT_OPTION, newOption, CONST_OPTION);
    return true;
};

import { Option } from './ns';
import { UTIL } from './lib/UTIL';

/**
 * Default Option
 */
export const DEFAULT_OPTION: Option = {
    path: '$id',
    url: undefined,
    ajaxType: 'get',
    ajaxCache: true,
    ajaxData: {},
    autocollect: true,
    override: {}
};

/**
 * Constant Option
 */
export const CONST_OPTION: Option = {};

/**
 * get/set Default Option
 * @example
 * var opt = AJST.option();                 // get Default
 * AJST.option({path: '/template/$id.tpl'}) // set option.path
 * AJST.option({util:{                      // set option.util.add
 *   add: function(a, b){ return +a + +b; }
 * }});
 */
export const option = (newOption?: Option): Option | boolean => {
    if (!newOption)
        return UTIL.extend({}, DEFAULT_OPTION);
    if (UTIL.isPlainObject(newOption))
        UTIL.extend(DEFAULT_OPTION, newOption, CONST_OPTION);
    return true;
};

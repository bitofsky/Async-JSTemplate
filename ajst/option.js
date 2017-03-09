"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UTIL_1 = require("./lib/UTIL");
exports.DEFAULT_OPTION = {
    url: '$id',
    ajaxType: 'get',
    ajaxCache: true,
    ajaxData: {},
    autocollect: true,
    override: {}
};
exports.CONST_OPTION = {};
exports.option = (newOption) => {
    if (!newOption)
        return UTIL_1.UTIL.extend({}, exports.DEFAULT_OPTION);
    if (UTIL_1.UTIL.isPlainObject(newOption))
        UTIL_1.UTIL.extend(exports.DEFAULT_OPTION, newOption, exports.CONST_OPTION);
    return true;
};
//# sourceMappingURL=option.js.map
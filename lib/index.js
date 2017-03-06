define(["require", "exports", "jquery", "./ajst", "../tab/About", "../tab/UnitTest"], function (require, exports, $, AJST, About_1, UnitTest_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    $(window).on('hashchange', onChangeHash);
    $(function () {
        AJST.option({ path: './tpl/$id.tpl', debug: true });
        AJST.autocollect();
        AJST.ajax('index', './data/config.json').then(function (output) {
            $('BODY').append(output);
            return false;
        }).then(onChangeHash);
    });
    function onChangeHash(onHashChanged) {
        var name = location.hash.split('/')[0].replace('#', '') || 'About';
        var args = location.hash.split('/')[1];
        switch (name) {
            case 'UnitTest':
                UnitTest_1.default(args);
                break;
            case 'About':
                About_1.default();
                break;
            default:
                !onHashChanged && About_1.default();
                name = 'About';
        }
    }
    ;
});
//# sourceMappingURL=index.js.map
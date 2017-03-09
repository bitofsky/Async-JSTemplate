import * as AJST from 'ajst';
import * as $ from 'jquery';
import About from '../tab/About';
import UnitTest from '../tab/UnitTest';

$(window).on('hashchange', onChangeHash);

$(function () {

    AJST.option({ url: './tpl/$id.tpl', debug: true });
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
            UnitTest(args);
            break;
        case 'About':
            About();
            break;
        default:
            !onHashChanged && About();
            name = 'About';
    }
}

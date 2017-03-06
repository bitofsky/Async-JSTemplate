/**
 * tab/About
 */
import * as $ from 'jquery';
import * as AJST from 'ajst';
import * as Showdown from 'showdown';

const Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (input) { var output = ""; var chr1, chr2, chr3, enc1, enc2, enc3, enc4; var i = 0; input = Base64._utf8_encode(input); while (i < input.length) { chr1 = input.charCodeAt(i++); chr2 = input.charCodeAt(i++); chr3 = input.charCodeAt(i++); enc1 = chr1 >> 2; enc2 = ((chr1 & 3) << 4) | (chr2 >> 4); enc3 = ((chr2 & 15) << 2) | (chr3 >> 6); enc4 = chr3 & 63; if (isNaN(chr2)) { enc3 = enc4 = 64; } else if (isNaN(chr3)) { enc4 = 64; } output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4); } return output; }, decode: function (input) { var output = ""; var chr1, chr2, chr3; var enc1, enc2, enc3, enc4; var i = 0; input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (i < input.length) { enc1 = this._keyStr.indexOf(input.charAt(i++)); enc2 = this._keyStr.indexOf(input.charAt(i++)); enc3 = this._keyStr.indexOf(input.charAt(i++)); enc4 = this._keyStr.indexOf(input.charAt(i++)); chr1 = (enc1 << 2) | (enc2 >> 4); chr2 = ((enc2 & 15) << 4) | (enc3 >> 2); chr3 = ((enc3 & 3) << 6) | enc4; output = output + String.fromCharCode(chr1); if (enc3 != 64) { output = output + String.fromCharCode(chr2); } if (enc4 != 64) { output = output + String.fromCharCode(chr3); } } output = Base64._utf8_decode(output); return output; }, _utf8_encode: function (string) { string = string.replace(/\r\n/g, "\n"); var utftext = ""; for (var n = 0; n < string.length; n++) { var c = string.charCodeAt(n); if (c < 128) { utftext += String.fromCharCode(c); } else if ((c > 127) && (c < 2048)) { utftext += String.fromCharCode((c >> 6) | 192); utftext += String.fromCharCode((c & 63) | 128); } else { utftext += String.fromCharCode((c >> 12) | 224); utftext += String.fromCharCode(((c >> 6) & 63) | 128); utftext += String.fromCharCode((c & 63) | 128); } } return utftext; }, _utf8_decode: function (utftext) { var string = ""; var i = 0; var c, c1, c2, c3; while (i < utftext.length) { c = utftext.charCodeAt(i); if (c < 128) { string += String.fromCharCode(c); i++; } else if ((c > 191) && (c < 224)) { c2 = utftext.charCodeAt(i + 1); string += String.fromCharCode(((c & 31) << 6) | (c2 & 63)); i += 2; } else { c2 = utftext.charCodeAt(i + 1); c3 = utftext.charCodeAt(i + 2); string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)); i += 3; } } return string; } };

ga('send', 'pageview', 'index');

const margin = 70;
const option: AJST.Option = AJST.option();
const ajax = option.global.util.ajax;

let pConfig, pReadme;

// window resize event
$(window).off('resize.INDEXJS').on('resize.INDEXJS', () =>
    $('BODY').scrollspy({ offset: margin + 5 }).scrollspy('refresh')
);

// navi scroll following
$('BODY').off('activate.bs.scrollspy').on('activate.bs.scrollspy', () => {
    if ($('.index-navi').css('overflow-y') == 'auto')
        $('.index-navi').scrollTop($('.index-navi > .active').position().top);
});

const About = async () => {

    const $container = $('body > .container').empty();

    pConfig = pConfig || ajax({ url: './data/config.json', dataType: 'json' });
    const config = await pConfig;
    pReadme = pReadme || ajax({ url: config.readme, useCors: true });
    const readme = await pReadme;
    const $readme = $((new Showdown.Converter()).makeHtml(readme));

    AJST.get('About', config).then(function (baseline) {

        $container.html(baseline);

        var $IndexContainer = $('#IndexContainer'),
            $IndexNavi = $('.index-navi', $container).on('click', 'LI', function () {

                var $this = $(this),
                    $target = $($this.children('A').attr('href'));

                $('HTML, BODY').clearQueue().animate({ scrollTop: $target.offset().top - margin }, 'fast');

                $target.clearQueue().css({
                    'backgroundColor': '#f00',
                    'color': '#fff',
                    'margin-right': 50
                }).animate({
                    'backgroundColor': "#fff",
                    'color': "#000",
                    'margin-right': 0
                }, 'slow', function () {
                    // start scrollspy
                    $(window).trigger('resize.INDEXJS');
                });

                ga('send', 'event', 'index', 'click', $this.children('A').text());

                return false;

            });

        var parent = $IndexNavi;

        // make navi..
        $readme.filter('H1, H2, H3, H4, H5').each(function () {

            var text = this.innerText,
                id = Base64.encode(text).replace(/[\W]/g, '_');

            $(this).attr('id', id);

            var $li = $('<li><a href="#' + id + '"></a></li>');

            $li.children('A').text(text).prepend('<i class="icon-check-empty"></i><i class="icon-check"></i> ');

            if (this.tagName == 'H1') { // main
                parent = $('<ul class="nav nav-pills nav-stacked"></ul>').appendTo($li);
                $li.appendTo($IndexNavi);
            }
            else // sub
                $li.appendTo(parent);

        });

        $readme.appendTo($IndexContainer);

        var offsetTop = $IndexNavi.offset().top - margin;

        $IndexNavi.affix({ offset: { 'top': offsetTop } });

        // start scrollspy
        $(window).trigger('resize.INDEXJS');

    });

}

export default About;

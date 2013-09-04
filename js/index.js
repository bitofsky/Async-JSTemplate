/**
 * Index
 */

"use strict";

(function() {

  /**
   * AMD(Asynchronous Module Definition)
   */
  define(['AJST', 'jquery'], function(AJST, $) {

    return function() {

      ga('send', 'pageview', 'index');

      var margin = 70,
          ajax = AJST.option().global.util.ajax,
          $container = $('body > .container').empty();

      ajax({url: './data/config.json', dataType: 'json'}).then(function(config) {
        ajax({url: config.readme, useCors: true}).then(function(readme) {
          makeIndex(config, $((new Showdown.converter()).makeHtml(readme)));
        });
      });

      // window resize event
      $(window).off('resize.INDEXJS').on('resize.INDEXJS', function() {
        $('BODY').scrollspy({offset: margin + 5}).scrollspy('refresh');
      });

      // navi scroll following
      $('BODY').off('activate.bs.scrollspy').on('activate.bs.scrollspy', function() {
        if ($('.index-navi').css('overflow-y') == 'auto')
          $('.index-navi').scrollTop($('.index-navi > .active').position().top);
      });

      function makeIndex(config, $readme) {

        AJST('index', config, {url: './tpl/index.tpl'}).then(function(baseline) {

          $container.html(baseline);

          var $IndexContainer = $('#IndexContainer'),
              $IndexNavi = $('.index-navi', $container).on('click', 'LI', function() {

            var $this = $(this),
                $target = $($this.children('A').attr('href'));

            $('HTML, BODY').clearQueue().animate({scrollTop: $target.offset().top - margin}, 'fast');

            $target.clearQueue().css({
              'backgroundColor': '#f00',
              'color': '#fff',
              'margin-right': 50
            }).animate({
              'backgroundColor': "#fff",
              'color': "#000",
              'margin-right': 0
            }, 'slow', function() {
              // start scrollspy
              $(window).trigger('resize.INDEXJS');
            });

            ga('send', 'event', 'index', 'click', $this.children('A').text());

            return false;

          });

          var parent = $IndexNavi;

          // make navi..
          $readme.filter('H1, H2, H3, H4, H5').each(function() {

            var text = this.innerText,
                id = text.replace(/[\W]/g, '_');

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

          $IndexNavi.affix({offset: {'top': offsetTop}});

          // start scrollspy
          $(window).trigger('resize.INDEXJS');

        });

      }

    };

  });

})();

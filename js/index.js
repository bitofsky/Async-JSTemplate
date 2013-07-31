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

      var $container = $('body > .container').empty();

      AJST('index', null, {url: './tpl/index.tpl'}).then(function(output) {

        $container.html(output);

        $('.navbar-nav LI').removeClass('active').find('A[name=index]').parent().addClass('active');

      }, function(e) {
        throw e;
      });

    };

  });

})();
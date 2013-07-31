/**
 * Unit Test
 */

"use strict";

(function() {

  var TestGroups = {
    'Result Samples': [
      {
        id: 'if test success',
        func: function(id) {
          return AJST(id, null, {url: './tpl/UnitTest.tpl'});
        },
        result: "Succeed"
      },
      {
        id: 'if test fail',
        func: function(id) {
          return AJST(id, null, {url: './tpl/UnitTest.tpl'});
        },
        result: "Failed"
      },
      {
        id: 'on error - could not found TPL File.',
        func: function(id) {
          return AJST(id, null, {url: '404.not.found.tpl'});
        },
        result: "Error"
      },
      {
        id: 'on error - undefined TPL ID.',
        func: function(id) {
          return AJST(id, null, {url: './tpl/UnitTest.tpl'});
        },
        result: "Error"
      },
      {
        id: 'on error - Template syntax error.',
        func: function(id) {
          return AJST(id, null, {url: './tpl/UnitTest.tpl'});
        },
        result: "Error"
      },
      {
        id: 'on error - Compile error.',
        func: function(id) {
          return AJST(id, null, {url: './tpl/UnitTest.tpl'});
        },
        result: "Error"
      }
    ],
    'TestCase : Basic': [
      {
        id: 'Hello AJST!',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase1.tpl'});
        },
        result: "Hello!!"
      },
      {
        id: 'Condition: if else',
        func: function(id) {
          return AJST(id, {list: []}, {url: './tpl/TestCase1.tpl'});
        },
        result: "\nis true\n"
      },
      {
        id: 'Condition: switch case',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase1.tpl'});
        },
        result: "True"
      },
      {
        id: 'For',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase1.tpl'});
        },
        result: "\n  i = 1\n\n  i = 2\n\n  i = 3\n"
      },
      {
        id: 'For key:value',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase1.tpl'});
        },
        result: "\n  key = 1\n  value = A\n\n  key = 2\n  value = B\n\n  key = 3\n  value = C\n"
      },
      {
        id: 'ForEach',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase1.tpl'});
        },
        result: "\n  i = 1\n\n  i = 2\n\n  i = 3\n"
      },
      {
        id: 'Sub function',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase1.tpl'});
        },
        result: "\n  1 + 1 = 2\n  2 + 2 = 4\n  3 + 3 = 6"
      }
    ],
    'TestCase : Print & others': [
      {
        id: 'Template Output String',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase2.tpl'});
        },
        result: "Outside Tag. Output String.\nInside Tag. use print() or printf().\nClosed Tag. Output String.\nAnd <?=Output?>"
      },
      {
        id: 'print',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase2.tpl'});
        },
        result: "1 + 1 = 2\n2 + 2 = 4\n3 + 3 = 6\n"
      },
      {
        id: 'printf',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase2.tpl'});
        },
        result: "1 + 1 = 2.200\n2 + 2 = 4.400\n3 + 3 = 6.600\n"
      },
      {
        id: 'sprintf',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase2.tpl'});
        },
        result: "1 + 1 = 2.200\n2 + 2 = 4.400\n3 + 3 = 6.600\n"
      },
      {
        id: 'util.tag_escape, util.tag_unescape',
        func: function(id) {
          return AJST(id, {
            tag: "<h4>It's H4 Tag!</h4>"
          }, {url: './tpl/TestCase2.tpl'});
        },
        result: "original  = <h4>It's H4 Tag!</h4>\nescaped   = &lt;h4&gt;It&#039;s H4 Tag!&lt;/h4&gt;\nunescaped = <h4>It's H4 Tag!</h4>"
      },
      {
        id: 'option.global definition.',
        func: function(id) {
          return AJST(id, null, {
            url: './tpl/TestCase2.tpl',
            global: {
              add: function(a, b) {
                return +a + +b;
              },
              $: jQuery
            }
          });
        },
        result: "1 + 1 = 2\n2 + 2 = 4\n3 + 3 = 6\n\njQuery($) Ready?\n\"I am ready\""
      }
    ],
    'TestCase : Data': [
      {
        id: 'Template data',
        func: function(id) {
          return AJST(id, 'This is Template Data', {url: './tpl/TestCase3.tpl'});
        },
        result: "This is Template Data"
      },
      {
        id: 'Array data',
        func: function(id) {
          return AJST(id, [1, 2, 3], {url: './tpl/TestCase3.tpl'});
        },
        result: "1, 2, 3"
      },
      {
        id: 'Object data',
        func: function(id) {
          return AJST(id, {
            list: [1, 2, 3],
            add: function(a, b) {
              return +a + +b;
            }
          }, {url: './tpl/TestCase3.tpl'});
        },
        result: "1 + 1 = 2\n2 + 2 = 4\n3 + 3 = 6\n"
      },
      {
        id: 'Remote Data',
        func: function(id) {
          return AJST.ajax(id, 'sampledata.json', {url: './tpl/TestCase3.tpl'});
        },
        result: "data.items.length = 22"
      }
    ],
    'TestCase : Include': [
      {
        id: 'Include TPL',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase4.tpl'});
        },
        result: "This is Include TPL.sub"
      },
      {
        id: 'Include other tpl file',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase4.tpl'});
        },
        result: "This is include1."
      },
      {
        id: 'Include more..',
        func: function(id) {
          return AJST(id, null, {url: './tpl/TestCase4.tpl'});
        },
        result: "This is include2.\nInclude other tpl.\nThis is include1."
      },
      {
        id: 'Include multiple promise',
        func: function(id) {
          return AJST.Promise([
            AJST('include1'),
            AJST('include2'),
            AJST(id, null, {url: './tpl/TestCase4.tpl'})
          ]).then(function() {
            return Array.prototype.join.call(arguments, '');
          });
        },
        result: "This is include1.This is include2.\nInclude other tpl.\nThis is include1.Succeed!"
      }
    ],
    'TestCase : AutoCollection': [
      {
        id: 'Auto collection check',
        result: function() {
          return !!AJST.getTemplate('Auto collection check');
        }
      },
      {
        id: 'Auto replace check',
        result: function() {
          return !!$('P[id="p_Auto replace"]').length;
        }
      },
      {
        id: 'Auto replace with data check',
        result: function() {
          return $('P[id="p_Auto replace with data"]').text() == 'data is ready';
        }
      },
      {
        id: 'Auto replace with remote data check',
        result: function() {
          return $('P[id="p_Auto replace with remote data"]').text() == '22';
        }
      }
    ],
    'Examples': [
      {
        id: 'MemberList',
        func: function(id) {
          return AJST(id, [
            {nickname: 'John', age: 10},
            {nickname: 'Sam', age: 13},
            {nickname: 'Smith', age: 7},
            {nickname: 'Dextor', age: 12},
            {nickname: 'Christin', age: 9}
          ]);
        },
        result: "AJST MemberList Sample..\n<table class=\"table\">\n  <caption>Member List Table</caption>\n  <thead><th>nickname</th><th>age</th></thead>\n  <tbody>\n<tr><td>John</td><td>10</td></tr>\n<tr><td>Sam</td><td>13</td></tr>\n<tr><td>Smith</td><td>7</td></tr>\n<tr><td>Dextor</td><td>12</td></tr>\n<tr><td>Christin</td><td>9</td></tr>\n\n</tbody>\n</table>"
      }
    ]

  };

  function tag_escape(s) {
    return s.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#039;').replace(/"/g, '&quot;');
  }

  function tag_unescape(s) {
    return s.toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#0*39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  }

  function funcToString(fn) {
    return tag_escape(fn).replace(/              /g, '');
  }

  /**
   * AMD(Asynchronous Module Definition)
   */
  define(['AJST', 'jquery'], function(AJST, $) {

    return function(openCase) {

      var $container = $('BODY > .container').empty();

      AJST('unitTest', null, {url: './tpl/index.tpl'}).then(function(output) {

        $container.html(output);

        var $list = $('#TestList'),
            $result = $('#Result');

        for (var caseName in TestGroups) {

          $('<li/>')
              .attr({name: caseName})
              .html('<a href="#unittest/' + caseName + '">' + caseName + '</a>')
              .appendTo($list);

        }

        openCase = openCase || 'Result Samples';

        if (!TestGroups[openCase])
          openCase = 'Result Samples';

        newTest(TestGroups[openCase], openCase);

      });

      function newTest(TestList, caseName) {

        var $list = $('#TestList'),
            $result = $('#Result');

        $list.children('LI').removeClass('active').filter('[name="' + caseName + '"]').addClass('active');

        console.clear();

        $result.empty().append('<h3>' + caseName + '</h3>');

        TestList.forEach(function(test, idx) {

          var id = 'TestList_' + idx;

          var $group = $('<div/>').addClass('accordion-group').appendTo($result),
              $head = $('<div/>').addClass('accordion-heading').appendTo($group),
              $label = $('<span/>').addClass('label').html('<i class="icon-play-circle"></i> Loading..').appendTo($head),
              $toggle = $('<a/>').addClass('accordion-toggle inline').attr({href: '#' + id, 'data-toggle': 'collapse', 'data-parent': '#Result'}).text('Test ' + (idx + 1) + ' - ' + test.id).appendTo($head),
              $body = $('<div/>').addClass('accordion-body collapse').attr('id', id).appendTo($group),
              $inner = $('<div/>').addClass('accordion-inner').appendTo($body);

          if (test.func) {

            $inner
                .append('<h4>Test Code</h4>')
                .append('<pre>(' + funcToString(test.func) + ')("' + test.id + '").then(function(output){ alert(output); });</pre>');

            test.func(test.id).then(function(result) {

              $inner
                  .append('<h4>Template Source</h4>')
                  .append('<pre>' + tag_escape(AJST.getTemplate(test.id)) + '</pre>');

              if (result == test.result || (typeof test.result == 'function' && test.result())) {
                $label.addClass('label-success').html('<i class="icon-ok"></i> Success');
                $inner
                    .append('<h4>Result HTML Code</h4>')
                    .append('<pre>' + tag_escape(result) + '</pre>')
                    .append('<h4>Result Object</h4>')
                    .append(result);
              }

              else {

                $label.addClass('label-warning').html('<i class="icon-remove"></i> Fail');
                $inner
                    .append('<h4>Result HTML Code</h4>')
                    .append('<pre>' + tag_escape(result) + '</pre>')
                    .append('<h4>Right Result</h4>')
                    .append('<pre>' + tag_escape(test.result) + '</pre>')
                    .append('<h4>Result JSON</h4>')
                    .append('<code>' + tag_escape(JSON.stringify(result)) + '</code>');

                console.log(test.id + '\n', JSON.stringify(result));

              }

            }, function(e) {

              try {
                var tpl = tag_escape(AJST.getTemplate(test.id) || ''),
                    compiler = tpl ? tag_escape(AJST.getCompiler(test.id) || '') : '';
              } catch (e) {
              }

              $label.addClass('label-danger').html('<i class="icon-remove"></i> Error : ' + e.message);
              $inner
                  .append('<h4>Error</h4>')
                  .append('<p>' + e.message + '</p>')
                  .append('<h4>Template Source</h4>')
                  .append('<pre>' + tpl + '</pre>')
                  .append('<h4>Compiler</h4>')
                  .append('<pre>' + compiler + '</pre>');

            });
          }
          else {
            test.result() ?
                $label.addClass('label-success').html('<i class="icon-ok"></i> Success') :
                $label.addClass('label-warning').html('<i class="icon-remove"></i> Fail');

            $inner
                .append('<h4>Check function</h4>')
                .append('<pre>' + funcToString(test.result) + '</pre>');

          }

        });
      }
    };

  });

})();
/**
 * Unit Test
 */

"use strict";

(function() {

  /**
   * AMD(Asynchronous Module Definition)
   */
  define(['AJST', 'jquery', 'test'], function(AJST, $, TestGroups) {

    return function(openCase) {

      var $container = $('BODY > .container').empty();

      for (var firstKey in TestGroups)
        break;

      newTestGroup(TestGroups[openCase] || TestGroups[openCase = firstKey], openCase);

      function newTestGroup(TestList, caseName) {

        console.clear();

        ga('send', 'pageview', 'unittest/' + caseName);

        AJST('UnitTest', {
          TestGroups: TestGroups,
          caseName: caseName
        }).then(function(output) {

          $container.html(output);

          TestList.forEach(eachTest);

        });

      }

      function eachTest(testData) {

        var testFunction = testData.func,
            testName = testData.name;

        var $testContainer = $('#Result').find('[name="' + testName + '"]'),
            $label = $testContainer.find('.accordion-heading > .label'),
            $icon = $label.children('i'),
            $contents = $testContainer.find('.accordion-inner');


        testFunction(testData, testResult);


        function testResult(resultType, resultContents) {

          var labelClass, labelText, iconClass;

          switch (resultType) {
            case 'success':
              labelClass = 'success';
              labelText = 'Success';
              iconClass = 'ok';
              break;
            case 'fail'   :
              labelClass = 'warning';
              labelText = 'Fail';
              iconClass = 'exclamation-sign';
              break;
            case 'error'  :
              labelClass = 'danger';
              labelText = 'Error';
              iconClass = 'remove';
              break;
          }

          $label.addClass('label-' + labelClass).children('.label-text').text(labelText);
          $icon.removeClass().addClass('icon-' + iconClass);
          $contents.empty();

          for (var subtitle in resultContents)
            $contents.append('<h4>' + subtitle + '</h4>' + resultContents[subtitle]);

        }


      }

    };

  });

})();

define(["require", "exports", "jquery", "../lib/ajst", "../lib/TestGroup"], function (require, exports, $, AJST, TestGroup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UnitTest = function (openCase) {
        var $container = $('BODY > .container').empty();
        for (var firstKey in TestGroup_1.default)
            break;
        newTestGroup(TestGroup_1.default[openCase] || TestGroup_1.default[openCase = firstKey], openCase);
        function newTestGroup(TestList, caseName) {
            console.clear();
            ga('send', 'pageview', 'unittest/' + caseName);
            AJST.get('UnitTest', {
                TestGroups: TestGroup_1.default,
                caseName: caseName
            }).then(function (output) {
                $container.html(output);
                TestList.forEach(eachTest);
            });
        }
        function eachTest(testData) {
            var testFunction = testData.func, testName = testData.name;
            var $testContainer = $('#Result').find('[name="' + testName + '"]'), $label = $testContainer.find('.accordion-heading > .label'), $icon = $label.children('i'), $contents = $testContainer.find('.accordion-inner');
            testFunction(testData, testResult);
            function testResult(resultType, resultContents) {
                var labelClass, labelText, iconClass;
                switch (resultType) {
                    case 'success':
                        labelClass = 'success';
                        labelText = 'Success';
                        iconClass = 'ok';
                        break;
                    case 'fail':
                        labelClass = 'warning';
                        labelText = 'Fail';
                        iconClass = 'exclamation-sign';
                        break;
                    case 'error':
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
    exports.default = UnitTest;
});
//# sourceMappingURL=UnitTest.js.map
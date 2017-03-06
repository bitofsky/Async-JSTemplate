define(["require", "exports", "jquery", "ajst"], function (require, exports, $, AJST) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var returnTestResult = function (testData, testResult, testOutput) { };
    var tag_escape = function (s) {
        return (s || '').toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#039;').replace(/"/g, '&quot;');
    };
    var tag_unescape = function (s) {
        return (s || '').toString().replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#0*39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    };
    var funcToString = function (fn) {
        return tag_escape(fn).replace(/              /g, '');
    };
    var getTestFunction = function (testData, testResult) {
        testData.args = testData.args || [];
        var args = [testData.name, testData.args[0], testData.args[1]], resultContents = {}, resultType;
        var setTemplateSource = function () {
            resultContents['Template Source'] = '<pre>' + tag_escape(AJST.getTemplate(testData.name)) + '</pre>';
        };
        var success = function (result) {
            if (result === void 0) { result = ''; }
            setTemplateSource();
            resultType = 'success';
            resultContents['Result HTML Code'] = '<pre>' + tag_escape(result) + '</pre>';
            resultContents['Result Object'] = '<pre>' + result + '</pre>';
            testResult(resultType, resultContents);
        };
        var fail = function (result) {
            if (result === void 0) { result = ''; }
            setTemplateSource();
            resultType = 'fail';
            resultContents['Result HTML Code'] = '<pre>' + tag_escape(result) + '</pre>';
            resultContents['Right Result'] = '<pre>' + tag_escape(testData.result) + '</pre>';
            resultContents['Result JSON'] = '<code>' + tag_escape(JSON.stringify(result)) + '</code>';
            console.log(testData.name + '\n', JSON.stringify(result));
            testResult(resultType, resultContents);
        };
        var error = function (e) {
            setTemplateSource();
            try {
                var tpl = tag_escape(AJST.getTemplate(testData.name) || ''), compiler = tpl ? tag_escape(AJST.getCompiler(testData.name) || '') : '';
            }
            catch (e) {
            }
            resultType = 'error';
            resultContents = {
                'Error': '<p>' + e.message + '</p>',
                'Template Source': '<pre>' + tpl + '</pre>',
                'Compiler': '<pre>' + compiler + '</pre>'
            };
            testResult(resultType, resultContents);
            setTimeout(function () {
                throw e;
            });
        };
        var testReturns = testData.callFunction.apply(null, args);
        if (testReturns.then)
            testReturns.then(function (result) {
                testData.result == result ? success(result) : fail(result);
            }, error);
        else
            testReturns ? success() : fail();
    };
    var TestGroups = {
        'Result Samples': [
            {
                name: 'if test success',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase0.tpl' }],
                result: "Succeed"
            },
            {
                name: 'if test fail',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase0.tpl' }],
                result: "Failed"
            },
            {
                name: 'on error - could not found TPL File.',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: '404.not.found.tpl' }],
                result: "Error"
            },
            {
                name: 'on error - undefined TPL ID.',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase0.tpl' }],
                result: "Error"
            },
            {
                name: 'on error - Template syntax error.',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase0.tpl' }],
                result: "Error"
            },
            {
                name: 'on error - Compile error.',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase0.tpl' }],
                result: "Error"
            }
        ],
        'TestCase : Basic': [
            {
                name: 'Hello AJST!',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase1.tpl' }],
                result: "Hello!!"
            },
            {
                name: 'Condition: if else',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase1.tpl' }],
                result: "\nis true\n"
            },
            {
                name: 'Condition: switch case',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase1.tpl' }],
                result: "True"
            },
            {
                name: 'For',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase1.tpl' }],
                result: "\n  i = 1\n\n  i = 2\n\n  i = 3\n"
            },
            {
                name: 'For key:value',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase1.tpl' }],
                result: "\n  key = 1\n  value = A\n\n  key = 2\n  value = B\n\n  key = 3\n  value = C\n"
            },
            {
                name: 'ForEach',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase1.tpl' }],
                result: "\n  i = 1\n\n  i = 2\n\n  i = 3\n"
            },
            {
                name: 'Sub function',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase1.tpl' }],
                result: "\n  1 + 1 = 2\n  2 + 2 = 4\n  3 + 3 = 6"
            }
        ],
        'TestCase : Print & others': [
            {
                name: 'Template Output String',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase2.tpl' }],
                result: "Outside Tag. Output String.\nInside Tag. use print() or printf().\nClosed Tag. Output String.\nAnd <?=Output?>"
            },
            {
                name: 'print',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase2.tpl' }],
                result: "1 + 1 = 2\n2 + 2 = 4\n3 + 3 = 6\n"
            },
            {
                name: 'printf',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase2.tpl' }],
                result: "1 + 1 = 2.200\n2 + 2 = 4.400\n3 + 3 = 6.600\n"
            },
            {
                name: 'sprintf',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase2.tpl' }],
                result: "1 + 1 = 2.200\n2 + 2 = 4.400\n3 + 3 = 6.600\n"
            },
            {
                name: 'util.tag_escape, util.tag_unescape',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [{ tag: "<h4>It's H4 Tag!</h4>" }, { url: './tpl/TestCase2.tpl' }],
                result: "original  = <h4>It's H4 Tag!</h4>\nescaped   = &lt;h4&gt;It&#039;s H4 Tag!&lt;/h4&gt;\nunescaped = <h4>It's H4 Tag!</h4>"
            },
            {
                name: 'option.global definition.',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, {
                        url: './tpl/TestCase2.tpl',
                        global: {
                            add: function (a, b) {
                                return +a + +b;
                            },
                            $: $
                        }
                    }],
                result: "1 + 1 = 2\n2 + 2 = 4\n3 + 3 = 6\n\njQuery($) Ready?\n\"I am ready\""
            }
        ],
        'TestCase : Data': [
            {
                name: 'Template data',
                func: getTestFunction,
                callFunction: AJST.get,
                args: ['This is Template Data', { url: './tpl/TestCase3.tpl' }],
                result: "This is Template Data"
            },
            {
                name: 'Array data',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [[1, 2, 3], { url: './tpl/TestCase3.tpl' }],
                result: "1, 2, 3"
            },
            {
                name: 'Object data',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [{
                        list: [1, 2, 3],
                        add: function (a, b) {
                            return +a + +b;
                        }
                    }, { url: './tpl/TestCase3.tpl' }],
                result: "1 + 1 = 2\n2 + 2 = 4\n3 + 3 = 6\n"
            },
            {
                name: 'Remote Data',
                func: getTestFunction,
                callFunction: AJST.ajax,
                args: ['data/sampledata.json', { url: './tpl/TestCase3.tpl' }],
                result: "data.items.length = 22"
            },
            {
                name: 'Remote Data Promise',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [$.getJSON('data/sampledata.json'), { url: './tpl/TestCase3.tpl' }],
                result: "data.items.length = 22"
            }
        ],
        'TestCase : Include': [
            {
                name: 'Include TPL',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase4.tpl' }],
                result: "This is Include TPL.sub"
            },
            {
                name: 'Include other tpl file',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase4.tpl' }],
                result: "This is include1."
            },
            {
                name: 'Include more..',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase4.tpl' }],
                result: "This is include2.\nInclude other tpl.\nThis is include1."
            },
            {
                name: 'Include multiple promise',
                func: getTestFunction,
                callFunction: function () {
                    return Promise.all([
                        AJST.get('include1'),
                        AJST.get('include2'),
                        AJST.get('Include multiple promise', null, { url: './tpl/TestCase4.tpl' })
                    ]).then(function (all) {
                        return all.join('');
                    });
                },
                args: [],
                result: "This is include1.This is include2.\nInclude other tpl.\nThis is include1.Succeed!"
            },
            {
                name: 'Include with Data',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase4.tpl' }],
                result: 'result=abc'
            },
            {
                name: 'Include with Ajax Data',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase4.tpl' }],
                result: 'Open New'
            },
            {
                name: 'Include with Promise Data',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [null, { url: './tpl/TestCase4.tpl' }],
                result: 'Open New'
            },
        ],
        'TestCase : AutoCollection': [
            {
                name: 'Auto collection check',
                func: getTestFunction,
                callFunction: function () {
                    return !!AJST.getTemplate('Auto collection check');
                }
            },
            {
                name: 'Auto replace check',
                func: getTestFunction,
                callFunction: function () {
                    return !!$('P[id="p_Auto replace"]').length;
                }
            },
            {
                name: 'Auto replace with data check',
                func: getTestFunction,
                callFunction: function () {
                    return $('P[id="p_Auto replace with data"]').text().trim() == 'data is ready';
                }
            },
            {
                name: 'Auto replace with remote data check',
                func: getTestFunction,
                callFunction: function () {
                    return $('P[id="p_Auto replace with remote data"]').text().trim() == '22';
                }
            }
        ],
        'TestCase : Escape characters': [
            {
                name: 'Escape quotes',
                func: getTestFunction,
                callFunction: AJST.get,
                result: "He said: \"It's Fun ! \\\"Yeah!!\\\"\" 1\"2\"",
                setTemplate: (function () {
                    AJST.setTemplate('Escape quotes', 'He said: "It\'s Fun ! \\"Yeah!!\\"" <? var a = \'1\'; b = "\\"2\\""; print(a+b); ?>');
                    AJST.setTemplate('Escape {{script}}', 'Script inside Script {{script}}console.debug(1);{{/script}}');
                })()
            },
            {
                name: 'Escape {{script}}',
                func: getTestFunction,
                callFunction: AJST.get,
                result: "Script inside Script <script>console.debug(1);</script>"
            }
        ],
        'Examples': [
            {
                name: 'MemberList',
                func: getTestFunction,
                callFunction: AJST.get,
                args: [[
                        { nickname: 'John', age: 10 },
                        { nickname: 'Sam', age: 13 },
                        { nickname: 'Smith', age: 7 },
                        { nickname: 'Dextor', age: 12 },
                        { nickname: 'Christin', age: 9 }
                    ]],
                result: "AJST MemberList Sample..\n<table class=\"table\">\n  <caption>Member List Table</caption>\n  <thead><th>nickname</th><th>age</th></thead>\n  <tbody>\n<tr><td>John</td><td>10</td></tr>\n<tr><td>Sam</td><td>13</td></tr>\n<tr><td>Smith</td><td>7</td></tr>\n<tr><td>Dextor</td><td>12</td></tr>\n<tr><td>Christin</td><td>9</td></tr>\n\n</tbody>\n</table>"
            }
        ]
    };
    exports.default = TestGroups;
});
//# sourceMappingURL=TestGroup.js.map
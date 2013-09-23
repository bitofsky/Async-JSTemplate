AJST : Asynchronous JavaScript Template
================

# AJST란?

컨텐츠 생성을 위한 서버측 스크립트 엔진엔 많은 종류가 있습니다. (예> PHP, ASP, JSP, Smarty 등등..)

AJST는 서버측 보다는 클라이언트측에서 동작하도록 되어있습니다. 웹브라우저에서 템플릿 엔진이 동작하는 것이죠.

이것은 서버의 부하를 경감시키고 실시간으로 다이나믹하게 동작하며 컨텐츠를 생산하는 웹어플리케이션의 특징에 부합되어 개발이 보다 쉬워지도록 도와줍니다.

# 주요 기능

1. PHP나 ASP와 비슷한 구문을 사용 합니다. **<? ~ ?>**
2. 전용 템플릿 문법 없이 **자바스크립트** 를 사용 하므로 쉽습니다.
3. 템플릿 소스가 필요한 시점에 **자동으로 원격 로딩** 합니다.
4. 템플릿 안에서 **Include** 로 다른 템플릿을 참조시킬 수 있습니다.
5. CommonJS에 정의된 '[Promise/A](http://wiki.commonjs.org/wiki/Promises/A)'를 사용.

# 샘플 및 예제

#### 사용 방법

아래 스크립트 태그를 HTML 헤더에 넣어주세요.

    <script src="AJST.js"></script>

그리고 자바스크립트에서 AJST(**Tpl_ID**)를 실행합니다. 그러면 Promise 객체가 반환 됩니다.


    AJST('Hello').then(function( output ){
      $('BODY').html( output );
    });

이미 **Tpl_ID**='Hello' 가 클라이언트에 정의된 상태라면 템플릿이 즉시 생성 됩니다.

그렇지 않다면, TPL 소스파일(option.path/**Tpl_ID**.tpl)이 자동으로 [Ajax](http://en.wikipedia.org/wiki/Ajax)에 의해 로드 됩니다.

TPL 소스는 아래와 같은 문법으로 사용 합니다.

    ./path/Hello.tpl
    <script id="Hello">Hello, AJST!</script>

 * 하나의 .tpl 파일에 복수의 <script id="**Tpl_ID**"></script> 객체를 정의할 수 있습니다.
 * **Tpl_ID**은 고유키 입니다. 동시에 하나만 존재할 수 있고 한번 로딩된 TPL은 캐싱되어 재사용 됩니다.

# 문법

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/2.-Syntax)

AJST는 PHP나 ASP와 비슷한 구문을 사용 합니다. **<? ~ ?>**

자바스크립트로 문자열을 생성할 수 있습니다.

구문 안에서 문자열을 출력하려면 [print](https://github.com/bitofsky/Async-JSTemplate/wiki/4.-Utility-of-built-in#print-string-str-) 나 [printf](https://github.com/bitofsky/Async-JSTemplate/wiki/4.-Utility-of-built-in#printf-string-format-stringnumber-outn-) 를 쓰세요.

구문 밖에서는 모든 문자열이 자동 출력 됩니다.

    <script id="List">
    Hello <? if(true) print('AJST'); ?>!!
    </script>

    output
    Hello AJST!!

또한 <?=...?> 구문으로 출력할 수도 있습니다.

이 구문은 간단하게 문자열을 출력할 때 유용하며 끝에 세미콜론(;)을 넣지 않습니다.

    Hello <?=true ? 'AJST':''?>!!

    output
    Hello AJST!!

구문 안에서 새로운 변수나 함수를 생성하고 사용할 수 있습니다.
You can also choose to create and run a new variables and functions in the Syntax.

구문 안에서 정의되면 이 템플릿 ID 내부 스코프([Scope](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope)) 내에서만 유효하게 접근할 수 있습니다.

글로벌 변수나 다른 템플릿에는 영향이 가지 않습니다.

    <?
    var getButton = function( text ){ printf('<button type="button">%s</button>\n', text); };
    ?>
    Hello Buttons!
    <?
    ['one','two'].forEach( getButton );
    ?>

    output
    Hello Buttons!
    <button type="button">one</button>
    <button type="button">two</button>

#### 데이터 전달(data)

템플릿을 생성할 때 data를 전달할 수 있습니다.
data는 AJST 실행 시 2번째 인자로 전달 합니다.

    <?
    for( var key in data )
      printf('Item key : %s, value : %s\n', key, data[key]);
    ?>

    script
    AJST('List', {"aa":"AA", "bb":"BB", "cc":"CC"}).then(function( output ){  });

    output
    Item key : aa, value : AA
    Item key : bb, value : BB
    Item key : cc, value : CC

data의 유형은 무엇이든 가능 합니다.
숫자, 문자, 객체, 심지어 함수도 가능합니다.

    <script id="Add">
    <?=data(1,2)?>
    </script>

    script
    AJST('Add', function(a,b){ return +a + +b; }).then(function( output ){  });

    output
    3

원격으로 JSON 데이터를 받아와야 한다면 AJST.ajax 를 사용할 수도 있습니다.
URL이나 Promise를 2번째 인자로 전달하면 됩니다.

    <script id="RemoteData">
    <?
    data.forEach(function(value, key){
      print('value = ' + value);
    });
    ?>
    </script>

    script
    AJST.ajax('RemoteData', 'http://url.data.json').then(function( output ){ });

#### $id

변수 $id 는 구문 안에서 현재 템플릿의 **Tpl_ID** 를 가지고 있습니다.

    <script id="template">
    I am <?=$id?>
    </script>

    output
    I am template
    
# Include

AJST는 템플릿 안에서 다른 템플릿을 include 할 수 있습니다. 심지어 다른 .tpl 파일의 템플릿이라도 상관 없으며, 자동으로 로드 됩니다.
include 된 템플릿에서 또다른 템플릿을 include 할 수도 있습니다. 이 역시 자동으로 핸들링 됩니다.

#### include( {String tpl_id}, [{Mixed data}], [{Object option}] )

    <script id="Table">
    <table>
      <tr>
        <td>Name</td> <td>Age</td> <td>Child</td>
      </tr>
      <? data.forEach(function( person ){
        include("Table-td", person);
      }); ?>
    </table>
    </script>
    <script id="Table-td">
      <tr>
        <td><?=data.name?></td>
        <td><?=data.age?></td>
        <td><?=data.child ? include('Table', data.child) : ""?></td>
      </tr>
    </script>

#### includeEach( {String tpl_id}, {Object|Array data}, [{Object option}] )

만약 배열이나 객체의 하위요소를 각각 include 하려면 includeEach 를 사용해 보세요.

    <script id="Table">
    <table>
      <tr>
        <td>Name</td> <td>Age</td> <td>Child</td>
      </tr>
      <? includeEach("Table-td", data); ?>
    </table>
    </script>
    <script id="Table-td">
      <tr>
        <td><?=data.name?></td>
        <td><?=data.age?></td>
        <td><?=data.child ? include('Table', data.child) : ""?></td>
      </tr>
    </script>

# Promise 사용 방법

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/3.-How-to-use-Promise)

AJST는 Promise 를 기반으로 동작 합니다. 모든 요청은 Promise 객체가 반환됩니다.

이 Promise 로 다수의 비동기 콜을 제어하거나 손쉽게 오류를 핸들링 할 수 있습니다.

#### 성공(then) 또는 실패(fail) 콜백

만약 템플릿이 성공적으로 생성 되면 successCallback이 실행되어 생성된 템플릿 스트링이 전달 됩니다.

실패하면 failCallback 이 실행되어 오류가 전달 됩니다.

    AJST('TPL_ID').then( successCallback, failCallback );
    AJST('TPL_ID').then( successCallback ).fail( failCallback );

#### Promise 체인

Promise는 여러개를 체인으로 묶을 수 있습니다.

요청이 성공 또는 실패하면 콜백 함수가 실행되는데, 체인으로 묶인 순서대로 실행 됩니다.

만약 콜백 함수가 return 을 하지 않으면 전달 인자는 그대로 유지되어 다음 콜백 함수가 실행 됩니다.

만약 콜백 함수가 무언가를 return 하면 다음 콜백 함수의 첫번째 인자는 이 리턴 값이 됩니다.

    AJST('TPL_ID')
      .then(function( output ){
      }).then(function( output ){
        return {
          "html": output
        };
      }).then(function( obj ){
        // obj.html
      }).fail(function(err){
        // if error
      });

#### 복수 Promise 핸들링

만약 여러개의 Promise가 모두 성공했을 때에만 success 콜백을 실행하고 싶을 때가 있을겁니다.

이럴때 AJST.Promise() 에 인자로 Promise를 전달하면 전달된 Promise가 모두 성공일 때에만 success 콜백이 실행됩니다.

Promise 중 하나라도 실패하면 fail 콜백이 실행됩니다.

    AJST.Promise(
      AJST('TPL_A'),
      AJST('TPL_B'),
      AJST('TPL_C')
    ).then(function( outputA, outputB, outputC ){
      // if all is successful,
    }, fail( err ){
      // if not,
    });

# 왜 Promise/A 를 사용 할까요?

> **Problems when using asynchronous programming** : [MSDN](http://msdn.microsoft.com/en-us/library/windows/apps/hh700330.aspx)
> 
> Asynchronous programming can quickly become complicated. Many of the standard JavaScript APIs rely heavily on callbacks, which are often nested, making them difficult to debug. In addition, the use of anonymous inline functions can make reading the call stack problematic. Exceptions that are thrown from within a heavily nested set of callbacks might not be propagated up to a function that initiated the chain. This makes it difficult to determine exactly where a bug is hidden.

# 내장 유틸리티

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/4.-Utility-of-built-in)

# 자동 수집

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/5.-AutoCollect)

# &lt;Script&gt; 태그 이스케이프

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/6.-Escape-Script-Tag)

# 데모

@see [AJST Introduce & Test with Bootstrap 3](http://bitofsky.github.io/Async-JSTemplate/)

# [AMD](https://github.com/amdjs/amdjs-api/wiki)를 지원

[require.js](http://requirejs.org)를 사용하여 비동기 모듈로 AJST를 로드할 수 있습니다.

이 경우 AJST가 딜레이 되어 로드되니 자동수집[AJST.autocollect](#ajstautocollect)을 사용하는 경우 이를 수동으로 활성화 해야 합니다.

# 지원 브라우져

 * IE7+ (IE7 [JSON](http://json.org) 필수, IE8 [es5-shim](https://github.com/kriskowal/es5-shim/) 필수)
 * Google Chrome
 * Safari
 * FireFox
 * Opera

# 다음에 영향을 받음

 * John Resig : [JavaScript Micro-Templating](http://ejohn.org/blog/javascript-micro-templating/)
 * blueimp : [JavaScript-Templates](https://github.com/blueimp/JavaScript-Templates/)

# License

(The MIT License)

Copyright (c) 2013 Bum-seok Hwang <bitofsky@neowiz.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

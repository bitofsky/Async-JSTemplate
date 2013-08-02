AJST : Asynchronous JavaScript Template
================

# What is AJST?

The template engine for static content, there are a lot of famous like PHP.

AJST creates a template on the client side rather than the server side, It was developed to make it easy to generate content in real time in the Web browser.

If you're looking for a JavaScript Template engine, I think this is the reason.

AJST is useful if you want to generate the HTML content dynamically, such as a Web application.

# Features

1. uses syntax similar to the PHP / ASP. **<? ~ ?>**
2. accept **JavaScript** in your template syntax.
3. **remote load automatically** when needed source of templates that do not exist in the current HTML document.
4. In template source, which is supporting the **include** function to load the other templates source.
5. uses '[Promise/A](http://wiki.commonjs.org/wiki/Promises/A)' defined in CommonJS.

# Examples

#### How to use

Please insert following Script-Tag in your HTML Header.

    <script src="AJST.js"></script>

and run AJST(**Tpl_ID**). It will return back the new Promise().


    AJST('Hello').then(function( output ){
      $('BODY').html( output );
    });

If you already defined **Tpl_ID**='Hello' then template will be created immediately.

if not, TPL source file(option.path/**Tpl_ID**.tpl) will automatically load by [Ajax](http://en.wikipedia.org/wiki/Ajax).

TPL Source is defined by the following syntax.

    ./path/Hello.tpl
    <script id="Hello">Hello, AJST!</script>

 * It is possible to define a multiple **Tpl_ID** Scripts into one file.
 * **Tpl_ID** is unique key. this is only one at the same time.
 * It is automatically cached by **Tpl_ID**.

# Syntax

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/2.-Syntax)

AJST uses syntax similar to the PHP / ASP. **<? ~ ?>**

You can generate a string by using JavaScript, to output in this syntax.

In order to output a string in the syntax, you can use the [print](print-string-str-) or [printf](printf-string-format-stringnumber-outn-).

Outside of the syntax, all strings will be output automatically.

    <script id="List">
    Hello <? if(true) print('AJST'); ?>!!
    </script>

    output
    Hello AJST!!

You can also use the syntax of the <?=?> line output statement.

This syntax is convenient to use the type to be output immediately.

Semicolon is not appended to the end.

    Hello <?=true ? 'AJST':''?>!!

    output
    Hello AJST!!

You can also choose to create and run a new variables and functions in the Syntax.

Variable that has been declared here, The only valid this [Scope](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope) of one-time

It does not affect the global variables such as templates and other.

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

#### data

You pass the data can be used in the template syntax.

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

You can use it also put function.

    <script id="Add">
    <?=data.add(1,2)?>
    </script>

    script
    AJST('Add', function(a,b){ return +a + +b; }).then(function( output ){  });

    output
    3

You can use the AJST.ajax if use remote data.

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

You can use the variable $id to have a **Tpl_ID** in syntax.

    <script id="template">
    I am <?=$id?>
    </script>

    output
    I am template

# How to use Promise

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/3.-How-to-use-Promise)

AJST works on the basis of Promise. All requests, it will generate and return the Promise.

You can Asynchronous multiple calls and error handling easily When you use the method Promise provided by.

#### Success or failure callbacks

If successfully created the template, Template is passed successCallback is executed.

If it fails, the failCallback is executed, an error is passed.

    AJST('TPL_ID').then( successCallback, failCallback );
    AJST('TPL_ID').then( successCallback ).fail( failCallback );

#### Promise Chainning

Promise can be chainning multiple .then().

If success or failure, Callback is executed in the order in which they were connected.

If do not return a value from the Callback that was executed, the first argument would be passed continue,

If returns a value, Callback takes as argument the value returned then.

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

#### Multiple Promises

You may want to run a successful Callback only if multiple Promises all succeed.

if you use a AJST.Promise() that is provided to easily control in such a case.

    AJST.Promise(
      AJST('TPL_A'),
      AJST('TPL_B'),
      AJST('TPL_C')
    ).then(function( outputA, outputB, outputC ){
      // if all is successful,
    }, fail( err ){
      // if not,
    });


# Utility of built in

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/4.-Utility-of-built-in)

# AutoCollect

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/5.-AutoCollect)

# Escape &lt;Script&gt; tag

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/6.-Escape-Script-Tag)

# Demo

@see [AJST Introduce & Test with Bootstrap 3](http://bitofsky.github.io/Async-JSTemplate/)

# AJST support [AMD](https://github.com/amdjs/amdjs-api/wiki).

You can call asynchronously by using [require.js](http://requirejs.org).

In this case, the execution is delayed. so you must be run manually [AJST.autocollect](#ajstautocollect).

# Supported Web Browsers

 * IE8+ (IE8 required [es5-shim](https://github.com/kriskowal/es5-shim/)
 * Google Chrome
 * Safari
 * FireFox
 * Opera

# Inspired by

 * John Resig : [JavaScript Micro-Templating](http://ejohn.org/blog/javascript-micro-templating/)
 * blueimp : [JavaScript-Templates](https://github.com/blueimp/JavaScript-Templates/)

# License

(The MIT License)

Copyright (c) 2013 Bum-seok Hwang <bitofsky@neowiz.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

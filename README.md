AJST : Asynchronous JavaScript Template
================

# What is AJST?

The template engine for static content, there are a lot of famous like PHP.

AJST creates a template on the client side rather than the server side, It was developed to make it easy to generate content in real time in the Web browser.

It sounds like some in this situation exactly if you have been looking for a JavaScript template engine.

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

# How to use Promise

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/3.-How-to-use-Promise)

# Utility of built in

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/4.-Utility-of-built-in)

# AutoCollect

@see [Wiki](https://github.com/bitofsky/Async-JSTemplate/wiki/5.-AutoCollect)

# AJST support [AMD](https://github.com/amdjs/amdjs-api/wiki).

You can call asynchronously by using [require.js](http://requirejs.org).

In this case, the execution is delayed. so you must be run manually [AJST.autocollect](#ajstautocollect).

# Inspired by

 * John Resig : [JavaScript Micro-Templating](http://ejohn.org/blog/javascript-micro-templating/)
 * blueimp : [JavaScript-Templates](https://github.com/blueimp/JavaScript-Templates/)

# License
(The MIT License)

Copyright (c) 2013 Bum-seok Hwang <bitofsky@neowiz.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

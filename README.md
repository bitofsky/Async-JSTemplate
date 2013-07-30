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

# Promise 사용하기

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


# Utility of built-in

AJST is providing several utilities that can be used in the template syntax.

#### print( [{String str}] )

The function that the output is specified in the argument.

    <?
    print('aa','bb');
    ?>

    output
    aabb

#### printf( {String format} [,{String|Number outN}] )

This is a function for output to match the format that has been input. It work similar to printf in PHP.

    <?
    printf('%d + %.2f = %.2f', 1, 1.2, 2.2);
    ?>

    output
    1 + 1.20 = 2.20

#### sprintf( {String format} [,{String|Number outN}] )

This is a function for return to match the format that has been input. It work similar to sprintf in PHP.

    <?=sprintf('%d + %.2f = %.2f', 1, 1.2, 2.2);

    output
    1 + 1.20 = 2.20

#### util.isIE8 {Boolean}

It have a true if only less than IE8. If not, false.

#### util.each( {Object|Array obj}, {Function callback} )

If the first argument is Object or Array, will run the second argument for each.

    <?
    util.each({a:10, b:20}, function(value, key){
      printf('key: %s, value: %s\n', key, value);
    });
    ?>

    output
    key: a, value=10
    key: b, value=20

#### util.toArray( {Object|Array obj} )

If the argument is an Object or Array, Returns an array in contained values

    <?
    util.toArray( arguments ).forEach(function(arg){ /*...*/ });
    ?>

#### util.tag_escape( {String tag} )

Returns by replacing the tag string.

    <?=util.tag_escape('<span>text</span>')?>

    output
    &lt;span&gt;text&lt;/span&gt;

* & : &amp;amp;
* < : &amp;lt;
* > : &amp;gt;
* ' : &amp;#039;
* " : &amp;quot;

#### util.tag_unescape( {String escapedTag} )

Returns by restoring the escaped tag string.

    <?=util.tag_unescape('&lt;span&gt;text&lt;/span&gt;')?>

    output
    <span>text</span>

* &amp;amp; : &
* &amp;lt; : <
* &amp;gt; : >
* &amp;#039; : '
* &amp;quot; : "

#### util.makeUID( {String prefix} )

It will generate and return the random Unique ID.

    new id = <?=util.makeUID()?>

    output
    new id = 13751575415646227269370

#### util.randomFromTo( {Number from}, {Number to} )

Returns to seek a random number between two numbers.

    random 1 to 10 = <?=util.randomFromTo(1, 10)?>

    output
    random 1 to 10 = 3

#### util.isFunction( {Mixed o} )

Returns true if the argument is a function. If not, false.

    printf is function = <?=util.isFunction( printf )?>

    output
    printf is function = True

#### util.isArray( {Mixed o} )

Returns true if the argument is an Array. If not, false.

    is array = <?=util.isArray([])?>

    output
    is array = True

#### util.isPlainObject( {Mixed o} )

Returns true if the argument is an [PlainObject](http://api.jquery.com/Types/#PlainObject). If not, false.

    is plain object = <?=util.isPlainObject({})?>

    output
    is plain object = True

#### util.extend( {Object a}, {Object b} )

Merge the contents of two or more objects together into the first object

    <?
      var a = {a:1},
          b = {b:2},
          c = util.extend(a, b);
      print( c.a + c.b );
    ?>

    output
    3

#### util.parseHTML( {String str} )

HTML string are converted to Elements and then return.

    <?
    var div = util.parseHTML('<div>aaa</div');
    print( div.innerHTML );
    ?>

    output
    aaa

#### util.parseXML( {String str} )

XML string are converted to xmlDocument and then return.

    <?
    var xml = util.parseHTML('<?xml version="1.0" encoding="utf-8"?><article></article>');
    ?>

#### util.ajax( {Object option} )

Ajax calls to try to option.url. Promise returns.

Similar with [jQuery.ajax](http://api.jquery.com/jQuery.ajax/). but provides only basic functionality only.

    <?
    // By importing JSON Data during the creation of the template, put a different template to this place.
    var id = util.makeUID();
    util.ajax({
      url: 'http://some.json.data',
      dataType: 'json'
    }).then(function( data ){
      AJST('SomeOtherTPL', data).then(function( otherHTML ){
        $('#'+id).html( otherHTML );
      });
    });
    ?>
    <div id=<?=id?>></div>

 * option.url {String} Ajax URL
 * option.type {String} Request method type. default=GET
 * option.header {Object} Request headers. default={'Content-Type': 'text/plain; charset=utf-8'}
 * option.data {Object} Request parameters. default={}
 * option.dataType {String} Type of return data. default='text'. [json or html or xml]
 * option.cache {Boolean} Whether to use the cache. Valid only for the GET method. default=true

# AutoCollect

AJST is the ability to automatically collect the template source that is contained in the document, to be definition.

That way, you can use immediately template source was placed in the BODY from the server.

Template source loaded in this way, to help the speed of the first content because it does not load the remote call.

    <html>
      <head>
        <script src="AJST.js">
        <script>
        function main(){
          AJST('Hello').then(function( output ){
            // output
          });
        }
        </script>
      </head>
      <body onload="main">
        <script id="Hello">
        Hello AJST!
        </script>
      </body>
    </html>

#### Attribute 'data-ajst'

You can insert Template at the same time as the definition. 'Script' must be inside BODY.

try use attribute 'data-ajst'.

    <script id="Hello" data-ajst="true">
    Hello AJST!
    </script>

#### Attribute 'data-ajst-data'

It is possible to define and use 'data'. it should be defined in the syntax of the [JSON](http://json.org).

    <script id="List" data-ajst="true" data-ajst-data='["one","two","tree"]'>
    <ol>
    <? for( var i in data ) printf('<li>%s</li>', data[i]); ?>
    </ol>
    </script>
    // output
    <ol>
    <li>one</li>
    <li>two</li>
    <li>three</li>
    </ol>

#### Attribute 'data-ajst-ajax'

To use the 'data-ajst-ajax' to retrieve 'data' from a remote location if. It must also be defined in [JSON](http://json.org).

If you want to import data from other Host, the server must support the [CORS](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

    <script id="List" data-ajst="true" data-ajst-ajax="http://dataLocation">
    <ol>
    <? for( var i in data ) printf('<li>%s</li>', data[i]); ?>
    </ol>
    </script>

#### AJST.autocollect

If you delay execution with AMD. or need to be run manually.

    require("ajst/path/AJST", function( AJST ){
      // use AJST.
      AJST.autocollect();
      AJST('Hello').then(function( output ){
        $('BODY').html( output );
      });
    });


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

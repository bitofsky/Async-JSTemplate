AJST : Asynchronous JavaScript Template
================

# Introduce

AJST is a JavaScript template engine based on Promise A+.

Template files and data are called asynchronously at the required time to generate Output.


# Features

1. The syntax is similar to PHP. **&lt;? ... ?&gt;**
2. It uses **pure JavaScript** without a dedicated template syntax or API.
3. If necessary, the template is automatically loaded.
4. In the template file you may refer to a different template. Output is returned when all the necessary templates are ready.
5. It uses [ES6 Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)

# Install

```
npm install ajst --save
```

## Use ES-Module (like TypeScript)
```javascript
import * as AJST from 'ajst'; // npm module require
or
import * as AJST from 'node_modules/ajst/ajst'; // ajst (for ES-Module)

AJST.get(Tpl_ID, data).then(output =>
  $('#output').html(output)
);
```

## Use AMD (like RequireJS)
```javascript
requirejs.config({
  baseUrl: 'js',
  paths: {
    ajst: 'pathToAJST/index' // ajst/index.js (for AMD bundle)
  }
})
require(['ajst'], async AJST => {
  const output = await AJST.get(Tpl_ID, data);
  $('#output').html(output);
});
```

# How to use
tpl/hello.html
```html
Hello, <?include('tpl/world.html', {name: 'John Smith'})?>
```
tpl/world.html
```html
world! <?=data.name?>
```
index.js
```javascript
AJST.get('tpl/hello.html').then(output => {
  console.log(output); // Hello, world! John Smith
})
```

# Demo

@see [AJST Introduce & Test with Bootstrap 3](http://bitofsky.github.io/Async-JSTemplate/)

# Browser Compatibility

 * IE9+ (IE9 requires [es6-shim](https://github.com/paulmillr/es6-shim))
 * Google Chrome
 * Safari
 * FireFox
 * Opera

# Inspired by...

 * John Resig : [JavaScript Micro-Templating](http://ejohn.org/blog/javascript-micro-templating/)
 * blueimp : [JavaScript-Templates](https://github.com/blueimp/JavaScript-Templates/)

# License

(The MIT License)

Copyright (c) 2013 Bum-seok Hwang <bitofsky@naver.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

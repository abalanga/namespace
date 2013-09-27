    ,--,--,  ,--,--.,--,--,--. ,---.  ,---.  ,---.  ,--,--. ,---. ,---.
    |      \' ,-.  ||        || .-. :(  .-' | .-. |' ,-.  || .--'| .-. :
    |  ||  |\ '-'  ||  |  |  |\   --..-'  `)| '-' '\ '-'  |\ `--.\   --.
    `--''--' `--`--'`--`--`--' `----'`----' |  |-'  `--`--' `---' `----'
                                            `--'

[![Build Status](https://travis-ci.org/abalanga/namespace.png?branch=master)](https://travis-ci.org/abalanga/namespace/)

namespace.js is a library for JavaScript that provides support for creating and accessing namespaces
across multiple files.

## Getting started

You can checkout the library from git or use bower:

```shell
bower install namespace --save
```
The library is AMD compatible so you can load it with require or import it into your HTML:

```html
<script src='namespace.js' type='text/javascript></script>
```

## How to use

### In plain JavaScript:

```js
var ns = new namespace();
var myApp = ns.import('myApp');
ns.register('myApp.util.alert': function() { window.alert(arguments); });
ns.register('myApp.util.log': function() { console.log(arguments); });
myApp.util.alert('alert test');
myApp.util.log('log test');
```

**or**

```js
var ns = new namespace();
var myApp = ns.import('myApp');
ns.register('myApp.util': {
    alert: function() { window.alert(arguments); },
    log: function() { console.log(arguments); }
});
myApp.util.alert('alert test');
myApp.util.log('log test');
```

### In requireJS:

**main.js**
```js
require(['app', 'alert', 'echo'], function () {
    var myApp = app.import('myApp');
    myApp.util.alert('alert test');
    myApp.util.log('log test');
});
```

**app.js**
```js
define(['namespace'], function () {
    var app = new namespace();
    return app;
});
```

**alert.js**
```js
define(['app'], function (app) {
    function alert () { window.alert(arguments); }
    app.register('myApp.util.alert', alert);
    return alert;
});
```

**log.js**
```js
define(['app'], function (app) {
    function log () { console.log(arguments); }
    app.register('myApp.util.log', log);
    return log;
});
```

## License

Copyright (c) 2013 Adam Balanga

It is free software, and may be redistributed under the terms of MIT license.

It can be found here: https://github.com/abalanga/namespace
    

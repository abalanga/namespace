// namespace.js 0.5.2
// https://github.com/abalanga/namespace
// (c) 2013 Adam Balanga
// namespace may be freely distributed under the MIT license.
// jshint boss:true
(function (window) {
    var namespace = function () {};
    var slice = Array.prototype.slice;
    var namespaceRegexp = /^([$A-Z_][0-9A-Z_$]*)(\.[$A-Z_][0-9A-Z_$]*)*$/i;

    function NamespaceError () {
        var error = Error.apply(this, arguments);
        error.name = "NamespaceError";
        return error;
    }

    function _checkNamespace (namespace) {
        return namespaceRegexp.test(namespace) && namespace || (function(){ throw new NamespaceError('Invalid namespace \'' + namespace + '\' provided.'); })();
    }

    function _extend (obj1, obj2){
        for (var key in obj2) { if (obj2.hasOwnProperty(key)) { obj1[key] = obj2[key]; } }
        return obj2 && _extend.apply(this, [obj1].concat(slice.call(arguments, 2))) || obj1;
    }

    function _getModule (module, options) {
        return this[module] = this[module] || this.initialize(options);
    }

    function _import (options, namespace) {
        if (arguments.length > 2) {
            return _import.apply(_getModule.call(this, namespace, options), [options].concat(slice.call(arguments, 2)));
        }
        return namespace && _getModule.call(this, namespace, options) || this;
    }

    function _isString (str) {
        return typeof str == "string" || typeof str == "object" && str.constructor === String;
    }

    function _register (obj, namespace){
        return _import.apply(this, [{}].concat(slice.call(arguments, 1, arguments.length-1)))[arguments[arguments.length-1]] = obj;
    }

    _extend(namespace.prototype, {
        import: function (namespace, options) {
            return _import.apply(this, [options||{}].concat((_checkNamespace(namespace) || namespace).split('.')));
        },
        initialize: function (options) {
            return _extend(new this.constructor(), options);
        },
        register: function (namespace, obj) {
            if (arguments.length < 2) { throw new NamespaceError('Two arguments are required.'); }
            if (!_isString(namespace)) { throw new NamespaceError('Namespace should be a string.'); }
            return _register.apply(this, [obj].concat((_checkNamespace(namespace)).split('.')));
        }
    });

    // Support node, AMD and global window variable if applicable.
    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = namespace;
    }
    else if (typeof define === "function" && define.amd) {
        define("namespace", [], function () { return namespace; } );
    }
    else if (typeof window === "object" && typeof window.document === "object") {
        window.namespace = namespace;
    }
})(window);
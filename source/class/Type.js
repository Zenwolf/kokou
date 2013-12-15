/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012, 2013 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

(function () {

var toStr = Object.prototype.toString;

function name(val) {
    return toStr.call(val).slice(8, -1);
}

/**
 * Library for checking object types.
 */
core.Module('kokou.Type', {

    isFunction: function (val) {
        return name(val) === 'Function';
    },

    isArray: function (val) {
        return name(val) === 'Array';
    },

    isObject: function (val) {
        return name(val) === 'Object';
    },

    isString: function (val) {
        return name(val) === 'String';
    },

    isNumber: function (val) {
        return name(val) === 'Number';
    },

    isBoolean: function (val) {
        return name(val) === 'Boolean';
    },

    isDate: function (val) {
        return name(val) === 'Date';
    },

    isRegExp: function (val) {
        return name(val) === 'RegExp';
    },

    isNull: function (val) {
        return name(val) === 'Null';
    },

    isUndefined: function (val) {
        return name(val) === 'Undefined';
    }
});

} ());

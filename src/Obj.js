/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Type = require('./Type.js');

module.exports = {

    /**
     * Deep clone a value.
     *
     * Supports:
     *   numbers, strings, booleans, null, undefined, object, array, regexp,
     *   and dates.
     *
     * No support:
     *   functions.
     */
    clone: function (val) {
        var i = 0;
        var l = 0;
        var copy;
        var name;

        if (Type.isNull(val) ||
            Type.isUndefined(val) ||
            Type.isString(val) ||
            Type.isNumber(val) ||
            Type.isBoolean(val)
        ) {
            return val;
        }

        if ( Type.isArray(val) ) {
            copy = [];

            for (i = 0, l = val.length; i < l; i++) {
                copy[i] = clone( val[i] );
            }

            return copy;
        }

        if ( Type.isObject(val) ) {
            copy = Object.create(null);

            for (name in val) {
                if ( val.hasOwnProperty(name) ) {
                    copy[name] = clone(val[name]);
                }
            }

            return copy;
        }

        if ( Type.isDate(val) ) {
            copy = new Date();
            copy.setTime( val.getTime() );

            return copy;
        }

        if ( Type.isRegExp(val) ) {
            return new RegExp(val);
        }

        throw new Error("Unable to copy: " + val);
    }

};

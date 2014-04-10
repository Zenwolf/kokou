/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012, 2013 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

(function () {

var type = kokou.Type;

core.Module('kokou.Obj', {

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

        if (type.isNull(val) ||
            type.isUndefined(val) ||
            type.isString(val) ||
            type.isNumber(val) ||
            type.isBoolean(val)
        ) {
            return val;
        }

        if ( type.isArray(val) ) {
            copy = [];

            for (i = 0, l = val.length; i < l; i++) {
                copy[i] = clone( val[i] );
            }

            return copy;
        }

        if ( type.isObject(val) ) {
            copy = Object.create(null);

            for (name in val) {
                if ( val.hasOwnProperty(name) ) {
                    copy[name] = clone(val[name]);
                }
            }

            return copy;
        }

        if ( type.isDate(val) ) {
            copy = new Date();
            copy.setTime( val.getTime() );

            return copy;
        }

        if ( type.isRegExp(val) ) {
            return new RegExp(val);
        }

        throw new Error("Unable to copy: " + val);
    }

});

} ());

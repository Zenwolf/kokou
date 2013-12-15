/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012, 2013 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
 * A default table implementation. Provides faster iteration
 * over properties than a normal object with for-in, since this can iterate
 * over a list of keys.
 */
core.Class('kokou.Table', {

    construct: function () {
        this.keys = [];
        this._data = {};
    },

    members: {

        /**
         * Put the @key {String} and @value {Any} pair into the table.
         */
        put: function (key, value) {
            var data = this._data;

            if ( !data.hasOwnProperty(key) ) {
                this.keys.push(key);
            }

            data[key] = value;
        },

        /**
         * Remove the @key {String} and its associated value from the table.
         */
        remove: function (key) {
            var data = this._data;
            var keys = this.keys;
            var removedVal;
            var i = 0;
            var l = 0;

            if ( !data.hasOwnProperty(key) ) {
                return;
            }

            removedVal = data[key];
            l = keys.length;

            for (; i < l; i += 1) {
                if (keys[i] !== key) {
                    continue;
                }

                delete data[key];
                keys[i] = keys[l - 1];
                l = l - 1;
                keys.length = l;
            }

            return removedVal;
        },

        /**
         *
         */
        get: function (key) {
            var data = this._data;

            if ( !data.hasOwnProperty(key) ) {
                return;
            }

            return data[key];
        },

        /**
         *
         */
        clear: function () {
            kokou.List.clear(this.keys);
            this._data = {};
        },

        /**
         *
         */
        forEach: function (fn, context) {
            var data = this._data;
            var keys = this.keys;
            var key = null;
            var i = 0;
            var l = keys.length;

            for (; i < l; i += 1) {
                key = keys[i];

                if (context) {
                    fn.call(context, key, data[key]);
                }
                else {
                    fn(key, data[key]);
                }
            }
        }
    }
});

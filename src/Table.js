/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var List = require('./List.js');

/**
 * A default table implementation. Provides faster iteration
 * over properties than a normal object with for-in, since this can iterate
 * over a list of keys.
 */
function Table() {
    this._keys = [];
    this._data = {};
}

Table.prototype = {
    /**
     * Put the @key {String} and @value {Any} pair into the table.
     */
    put: function (key, value) {
        var data = this._data;

        if ( !data.hasOwnProperty(key) ) {
            this._keys.push(key);
        }

        data[key] = value;
    },

    /**
     * Remove the @key {String} and its associated value from the table.
     */
    remove: function (key) {
        var data = this._data;
        var keys = this._keys;
        var removedVal;
        var i = 0;
        var l = 0;

        if ( !data.hasOwnProperty(key) ) {
            return;
        }

        removedVal = data[key] || null;
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

    get: function (key) {
        var data = this._data;

        if ( !data.hasOwnProperty(key) ) {
            return;
        }

        return data[key];
    },

    clear: function () {
        List.clear(this._keys);
        this._data = {};
    },

    keys: function() {
        return this._keys.slice();
    },

    vals: function() {
        var keys = this._keys;
        var data = this._data;
        var i = 0;
        var l = keys.length;
        var results = [];

        for (; i < l; i++) {
            results.push(data[keys[i]]);
        }

        return results;
    },

    forEach: function (fn, context) {
        var data = this._data;
        var keys = this._keys;
        var key = null;
        var i = 0;
        var l = keys.length;

        for (; i < l; i += 1) {
            key = keys[i];

            if (context) {
                fn.call(context, data[key], key);
            }
            else {
                fn(data[key], key);
            }
        }
    }
};

module.exports = Table;


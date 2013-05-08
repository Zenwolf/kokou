// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * A default table implementation. Provides faster iteration
 * over properties than a normal object with for-in, since this can iterate
 * over a list of keys.
 */
define(function () {
    var table  = {};
    var module = {};

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Table mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asTable = (function () {

        function initTable(config) {
            var tData = null;
            config = config || {};

            this.data = this.data || {};
            tData = this.data['table'] = {};

            tData.keys   = config.keys   || [];
            tData.values = config.values || {};

            return this;
        }

        function put(key, value) {
            var tData = this.data['table'];
            var keys = tData.keys;
            var vals = tData.values;

            if ( !vals.hasOwnProperty(key) ) {
                keys.push(key);
            }

            vals[key] = value;
        }

        function remove(key) {
            var tData = this.data['table'];
            var vals = tData.values;
            var keys = tData.keys;
            var removedVal;
            var i = 0;
            var l = 0;

            if ( !vals.hasOwnProperty(key) ) { return; }

            removedVal = vals[key];
            l = keys.length;

            for (; i < l; i += 1) {
                if (keys[i] !== key) { continue; }
                delete vals[key];
                keys[i] = keys[l - 1];
                l = l - 1;
                keys.length = l;
            }

            return removedVal;
        }

        function get(key) {
            var tData = this.data['table'];
            var vals = tData.values;

            if ( !vals.hasOwnProperty(key) ) { return; }
            return vals[key];
        }

        function forEach(fn, context) {
            var tData = this.data['table'];
            var keys = tData.keys;
            var vals = tData.values;
            var key = null;
            var i = 0;
            var l = keys.length;

            for (; i < l; i += 1) {
                key = keys[i];
                (context) ?
                    fn.call(context, key, vals[key]) :
                    fn(key, vals[key]);
            }
        }

        return function () {
            this.initTable = initTable;
            this.put       = put;
            this.remove    = remove;
            this.get       = get;
            this.forEach   = forEach;
        };
    } ());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototypical object.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    asTable.call(table);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory function, with optional config
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function create(config) {
        var obj = Object.create(table);

        config = ( typeof config === 'object' ) ? config : null ;

        if ( config !== null ) {
            obj.initTable(config);
        }

        return obj;
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public module.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.create  = create;  // factory
    module.asTable = asTable; // mixin

    return module;
});

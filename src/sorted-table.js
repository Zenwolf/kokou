// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

define(['./table', './list'], function (table, list) {

    var sortedTable  = {};
    var module = {};

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototypical object.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    table.asTable.call(sortedTable);

    // Custom put method.
    sortedTable.put = function (key, value) {
        var data = this.data;
        var keys = data.keys;
        var vals = data.values;
        var index = -1;

        if ( !vals.hasOwnProperty(key) ) {
            index = list.indexOf(key, keys);
            keys.splice(index, 0, key);
        }

        vals[key] = value;
    };

    // Custom remove method.
    sortedTable.remove = function (key) {
        var data = this.data;
        var keys = data.keys;
        var vals = data.values;
        var index = -1;
        var removedVal;

        if ( !vals.hasOwnProperty(key) ) { return; }
        removedVal = vals[key];
        delete vals[key];
        index = list.indexOf(key, keys);
        keys.splice(index, 1);

        return removedVal;
    };


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory function, with optional config
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function create(config) {
        var obj = Object.create(sortedTable);

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

    return module;
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

(function (global) {

var kokou = global.kokou = (global.kokou || {});
var listUtil = kokou.List;

function SortedTable() {
    kokou.Table.call(this);
}

SortedTable.prototype = Object.create(kokou.Table.prototype);

SortedTable.prototype.put = function (key, value) {
    var data = this._data;
    var keys = this._keys;
    var index = -1;

    if ( !data.hasOwnProperty(key) ) {
        index = listUtil.indexOf(key, keys);
        keys.splice(index, 0, key);
    }

    data[key] = value;
};

SortedTable.prototype.remove = function (key) {
    var data = this._data;
    var keys = this._keys;
    var index = -1;
    var removedVal;

    if ( !data.hasOwnProperty(key) ) {
        return;
    }

    removedVal = data[key];
    delete data[key];
    index = listUtil.indexOf(key, keys);
    keys.splice(index, 1);

    return removedVal;
};

kokou.SortedTable = SortedTable;

} (this));

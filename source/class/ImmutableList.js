/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

(function (global) {
'use strict';

var slice = Array.prototype.slice;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// List API
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function add(item) {
    var a = this._a.slice();
    a.push(item);
    return new ImmutableList(a);
}

function remove(item) {
    var _a = this._a;
    var i = 0;
    var l = _a.length;
    var a = [];
    var val;

    for (; i < l; i++) {
        val = _a[i];

        if (val !== item) {
            a.push(val);
        }
    }

    return new ImmutableList(a);
}

function first() {
    var _a = this._a;
    return (_a.length > 0) ? _a[0] : null;
}

function last() {
    var _a = this._a;
    return (_a.length > 0) ? _a[_a.length - 1] : null;
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Standard Array API
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function concat() {
    var _a = this._a;
    var args = slice.call(arguments);

    return new ImmutableList(_a.concat.apply(_a, args));
}

function every(fn, context) {
    return this._a.every(fn, context);
}

function filter(fn, context) {
    return new ImmutableList(this._a.filter(fn, context));
}

function forEach(fn, context) {
    this._a.forEach(fn, context);
    return this;
}

function indexOf(item) {
    return this._a.indexOf(item);
}

function join(separator) {
    return this._a.join(separator);
}

function lastIndexOf(item, fromIndex) {
    return this._a.lastIndexOf(item, fromIndex);
}

function map(fn, context) {
    return new ImmutableList(this._a.map(fn, context));
}

function pop() {
    return this.remove(this.last());
}

var push = add;

function reduce(fn, context) {
    return new ImmutableList(this._a.reduce(fn, context));
}

function reduceRight(fn, context) {
    return new ImmutableList(this._a.reduceRight(fn, context));
}

function reverse() {
    return new ImmutableList(this._a.slice().reverse());
}

// Cannot mutate original array, so just return the first item.
function shift() {
    return this.first();
}

function slice(begin, end) {
    return new ImmutableList(this._a.slice(begin, end));
}

function some(fn, context) {
    return this._a.some(fn, context);
}

function sort(fn) {
    return new ImmutableList(this._a.slice().sort(fn));
}

function splice(index, howMany, insertItems) {
    var a = this._a.slice().splice(index, howMany, insertItems);
    return new ImmutableList(a);
}

function toLocaleString() {
    return this._a.toLocaleString();
}

function toString() {
    return this._a.toString();
}

function unshift() {
    var args = slice.call(arguments);
    return this.concat(args);
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Util functions
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function toArray() {
    return this._a.slice();
}

function toJSON() {
    return this.toArray();
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// APIs
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var listAPI = {
    add: add,
    remove: remove,
    first: first,
    last: last
};

var arrayAPI = {
    concat: concat,
    every: every,
    filter: filter,
    forEach: forEach,
    indexOf: indexOf,
    join: join,
    lastIndexOf: lastIndexOf,
    map: map,
    pop: pop,
    push: push,
    reduce: reduce,
    reduceRight: reduceRight,
    reverse: reverse,
    shift: shift,
    slice: slice,
    some: some,
    sort: sort,
    splice: splice,
    toLocaleString: toLocaleString,
    toString: toString,
    unshift: unshift
};

var utilAPI = {
    toArray: toArray,
    toJSON: toJSON
};



function ImmutableList(a) {
    var listKeys = Object.keys(listAPI);
    var arrayKeys = Object.keys(arrayAPI);
    var utilKeys = Object.keys(utilAPI);

    Object.defineProperty(this, '_a', {
        value: a.slice()
    });

    Object.freeze(this._a);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Make immutable list "array-like."
    // Bonus: This makes it much nicer to debug in the Chrome dev tools console,
    //   since it shows up like a normal array.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    this.length = this._a.length;

    this._a.forEach(function (val, i) {
        this[i] = val;
    }, this);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // List API
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    listKeys.forEach(function (key) {
        this[key] = listAPI[key];
    }, this);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Array API
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    arrayKeys.forEach(function (key) {
        this[key] = arrayAPI[key];
    }, this);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Util API
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    utilKeys.forEach(function (key) {
        this[key] = utilAPI[key];
    }, this);
}

global.ImmutableList = ImmutableList;

} (this));

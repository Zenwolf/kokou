/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
 * List/array utils.
 */
module.exports = {
    /*
     * {Array} Convert a @pseudoArray {Object} (one that has length and
     * Integer index properties) to a real array. Begin at
     * the @start {Integer} index, otherwise process the entire list.
     */
    toArray: function (pseudoArray, start) {
        var aSlice = Array.prototype.slice;

        // if no start provided or start is just zero, etc.
        if (!start || start < 1) {
            return aSlice.call(pseudoArray);
        }
        return aSlice.call(pseudoArray, start);
    },

    /*
     * {Primitive|Object|Function|Array} Find the first item in
     * a @list {Array}.
     */
    first: function (list) {
        return list[0];
    },

    /*
     * {Primitive|Object|Function|Array} Find the last item in
     * a @list {Array}.
     */
    last: function (list) {
        return list[list.length - 1];
    },

    /**
     * {Integer} Returns the calculated index of a @key {String} in a list
     * of sorted string @keys {Array} using a binary search.
     *
     */
    indexOf: function (key, keys) {
        var n = keys.length;
        var i = 0;
        var d = n;

        if (n === 0)           { return 0; }
        if (key < keys[0])     { return 0; }
        if (key > keys[n - 1]) { return n; }

        while (key !== keys[i] && d > 0.5) {
            d = d / 2;
            i += (key > keys[i] ? 1 : -1) * Math.round(d);
            if (key > keys[i - 1] && key < keys[i]) { d = 0; }
        }

        return i;
    },

    /**
     * {Array} Insert @item {Any}
     * into @a {Array} at @index {Integer}.
     */
    insertAt: function (a, index, item) {
        var i = index;
        var l = a.length;
        var k = l;

        if (l === 0) {
            a[0] = item;
            return a;
        }

        if (l === i) {
            a[l] = item;
            return a;
        }

        do {
            a[k] = a[k - 1];
            k--;
        }
        while (k > i);

        a[i] = item;
        return a;
    },

    /**
     * {Any} Remove the item at @index {Integer} from the @a {Array}.
     * Returns the remove value.
     */
    removeAt: function (a, index) {
        var i = index;
        var l = a.length - 1;
        var removedVal = a[index];
        for (; i < l; i++) {
            a[i] = a[i + 1];
        }
        a.length = l;
        return removedVal;
    },

    /**
     * {Array} Return a new copy of the @a {Array} with randomly sorted items.
     */
    shuffle: function (a) {
        return a.slice(0).sort(function () {
            return Math.random() > 0.5 ? 1 : -1;
        });
    },

    /**
     * {Array} Clone the @a {Array}.
     */
    clone: function (a) {
        return a.slice(0);
    },

    /**
     * The fastest way to clear an @a {Array} without incurring garbage
     * collection: http://jsperf.com/array-clearing-performance
     */
    clear: function (a) {
        while (a.length > 0) {
            a.pop();
        }
    }
};

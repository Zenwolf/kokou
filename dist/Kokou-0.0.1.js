!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.Kokou=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var List = _dereq_('./List.js');

var advice = {

    /**
     * @base {Function}, @before {Function}
     */
    before: function (base, before) {
        return function composedBefore() {
            var args = List.asArray(arguments);

            before.apply(this, args);
            return base.apply(this, args);
        };
    },

    /**
     * @base {Function}, @around {Function}
     */
    around: function (base, around) {
        return function composedAround() {
            var i = 0;
            var l = arguments.length;
            var args = new Array(l + 1);

            args[0] = base.bind(this);

            for (; i < l; i += 1) {
                args[i + 1] = arguments[i];
            }

            return around.apply(this, args);
        };
    },

    /**
     * @base {Function}, @after {Function}
     */
    after: function (base, after) {
        return function composedAfter() {
            var args = List.asArray(arguments, 0);
            var result = base.apply(this, args);

            after.apply(this, args);
            return result;
        };
    }
};

/**
 * A module for mixing-in Aspect-Oriented advice for cross-cutting concerns.
 */
module.exports = {

    /**
     * This is only intended to be used as a mixin for other objects. Only use
     * with "call" or "apply".
     */
    withAdvice: function () {
        Object.keys(advice).forEach(function (fnName) {
            this[fnName] = function (method, fn) {
                if ( typeof this[method] === 'function' ) {
                    this[method] = advice[fnName](this[method], fn);
                    return this[method];
                }
                else {
                    this[method] = fn;
                    return this[method];
                }
            };

        }, this);
    }

};

},{"./List.js":8}],2:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var listUtil = _dereq_('./List.js');
var SortedTable = _dereq_('./SortedTable.js');
var Subscription = _dereq_('./Subscription.js');

/**
 * A Channel used to keep track of a specific set of client IDs and listeners.
 */
function Channel() {
    this._listeners = new SortedTable();
}

Channel.prototype = {

    /**
     * Bind a @listener {Function} to a given @clientId {String},
     * with an optional @context {Object?}.
     */
    bind: function (clientId, listener, context) {
        this._listeners.put(clientId, [listener, context]);

        return new Subscription(this, clientId);
    },

    /**
     * Unbind the listener registered to a @clientId.
     * NOTE: use clientId index to unbind in O(log n) instead of O(n).
     */
    unbind: function (clientId) {
        return this._listeners.remove(clientId);
    },

    /**
     * Emit with optional args.
     *
     * NOTE: supports up to 5 optional args (uses Function.call to
     * prevent garbage collection).
     */
    emit: function (arg1, arg2, arg3, arg4, arg5) {

        function processListener(listener, clientId) {
            var fn = listener[0];
            var ctx = listener[1];

            (ctx) ?
                fn.call(ctx, arg1, arg2, arg3, arg4, arg5) :
                fn(arg1, arg2, arg3, arg4, arg5);
        }

        this._listeners.forEach(processListener);
    },

    /**
     * {Array} Returns an array of strings containing all the listener
     * keys.
     *
     * NOTE: this returns a new array, not the original one. Will cause GC
     * when you throw it away.
     */
    clientIds: function () {
        return this._listeners.keys();
    }
};

module.exports = Channel;

},{"./List.js":8,"./SortedTable.js":11,"./Subscription.js":12}],3:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
 * An event emitter.
 */
function Emitter() {
    this._listeners = {};
}

Emitter.prototype = {
    /**
     * Add a @listener {Function} for @eventName {String}
     * with @context {Object?} and whether or not it @isOnce {Boolean?}.
     */
    addListener: function (eventName, listener, context, isOnce) {
        var emitter = this;
        var listeners = this._listeners;
        var callback = listener;
        var entry = [];

        context = context || null;

        if (typeof isOnce !== 'boolean') {
            isOnce = false;
        }

        if (typeof listeners[eventName] === 'undefined') {
            listeners[eventName] = [];
        }

        if (isOnce) {
            callback = function () {
                emitter.removeListener(eventName, callback, context);
                listener.apply(this, Array.prototype.slice.call(arguments));
            };
        }

        entry[0] = callback; // The listener callback function.
        entry[1] = context;  // The context to execute the callback with.

        listeners[eventName].push(entry);
    },

    /**
     * Remove a @listener {Function} for @eventName {String} with a
     * @context {Object?}.
     */
    removeListener: function (eventName, listener, context) {
        var listeners = this._listeners[eventName];
        var entry = null;
        var i = 0;
        var l = 0;

        context = context || null;

        if (!listeners) {
            return;
        }

        l = listeners.length;

        for (; i < l; i += 1) {
            entry = listeners[i];

            if (entry[0] === listener && entry[1] === context) {
                listeners.splice(i, 1);
                break;
            }
        }
    },

    removeAllListeners: function (eventName) {
        var listeners = this._listeners[eventName];

        if (!listeners) {
            return;
        }

        // Clear array and prevent garbage collection.
        kokou.List.clear(listeners[eventName]);
    },

    /**
     * Clear every listener.
     */
    clearListeners: function () {
        this._listeners = {};
    },

    /**
     * {Array} Return a new array of the listeners
     * for @eventName {String}.
     */
    getListeners: function (eventName) {
        var listeners = this._listeners[eventName];
        var copy = [];

        if (listeners && listeners.length > 0) {
            copy = listeners.slice(0);
        }

        return copy;
    },

    /**
     * Convenience function to add a one-time @listener {Function} for
     * @eventName {String} with @context {Object?}.
     */
    once: function (eventName, listener, context) {
        this.addListener(eventName, listener, context, true);
    },

    /**
     * Emit an event with @eventName {String}, with support of up to
     * five arguments.
     */
    emit: function (eventName, arg1, arg2, arg3, arg4, arg5) {
        var listeners = this._listeners[eventName];
        var listener = null;
        var i = 0;
        var l = 0;

        if (!listeners) {
            return;
        }

        // Make a copy to protect against timing issues.
        listeners = listeners.slice(0);

        l = listeners.length;

        for (; i < l; i += 1){
            listener = listeners[i];

            // If the listener has scope
            if (listener[1]) {
                listener[0].call(listener[1],
                    arg1, arg2, arg3, arg4, arg5);
            }
            else {
                // Direct execution is faster when there is no scope.
                listener[0](arg1, arg2, arg3, arg4, arg5);
            }
        }
    }
};

module.exports = Emitter;

},{}],4:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var List = _dereq_('./List.js');

/*
 * A utility to support functional programming.
 */
module.exports = {

    /** {=Map} Functions that represent operators. */
    op: {
        '+'  : function (a, b) { return a + b; },
        '-'  : function (a, b) { return a - b; },
        '*'  : function (a, b) { return a * b; },
        '/'  : function (a, b) { return a / b; },
        '===': function (a, b) { return a === b; },
        '%'  : function (a, b) { return a % b; },
        '<'  : function (a, b) { return a < b; },
        '>'  : function (a, b) { return a > b; },
        '!'  : function (a) { return !a; }
    },

    /**
     * {Function} Partially apply the @fn {Function} with the
     * @context {Object?} and additional arguments. Returns a new partially
     * applied function.
     */
    partial: function (fn, ctx) {
        var asArray = List.asArray;
        var args = asArray(arguments, 2); // remove fn, ctx

        ctx = ctx || null;

        return function () {
            return fn.apply(ctx, args.concat( asArray(arguments) ));
        };
    },

    /*
     * {Function} Return a new function that executes @fn2 {Function} and passes
     * its return value to @fn1 {Function}. The returned function will return
     * the result of fn1( fn2(arguments) ) upon execution.
     */
    compose: function (fn1, fn2) {
        var ctx = this;
        return function () {
            return fn1( fn2.apply(ctx, List.asArray(arguments)) );
        };
    },

    composeAs: function (ctx) {
        return this.partial(this.compose, ctx);
    },

    /*
     * Flow a series of @fns {Array[Functions]} via callbacks. At the end of
     * the flow, call the @last {Function}.
     *
     * WARNING: beware of overflowing the stack with a large array of
     * functions (due to no tail recursion in JS).
     */
    flow: function (fns, last) {
        var f = last;
        var i = 0;
        var ctx = this;

        var makeFlowFn = function (fn, nextFn, ctx) {
            var func = null;

            if (ctx) {
                func = function (error) {
                    fn.call(ctx, error, nextFn);
                };
            }
            else {
                func = function (error) {
                    fn(error, nextFn);
                };
            }

            return func;
        };

        if (ctx) {
            f = function (error) {
                last.call(ctx, error);
            };
        }

        i = fns.length;

        // construct the function chain from inside-out.
        while (i--) {
            f = makeFlowFn(fns[i], f, ctx);
        }

        // Start the flow with no error.
        f(null);
    },

    flowAs: function (ctx) {
        return this.partial(this.flow, ctx);
    },

    /*
     * {Function} Sequence a @fns {Array[Function]} using partial application
     * and function composition. The next function is always passed the return
     * value of the previous function. Returns the first function
     * in the sequence.
     */
    sequence: function (fns) {
        var i = fns.length;
        var currentFn = null;
        var prevFn = null;
        var isLast = true;
        var partial = this.partial;
        var compose = this.compose;
        var ctx = this;

        function makeFn(fn1, fn2) {
            return compose(fn2, partial(fn1, ctx), ctx);
        }

        while (i--) {
            prevFn = fns[i] || null;

            if (isLast) {
                currentFn = partial(prevFn, ctx);
                isLast = false;
            }
            else if (prevFn) {
                currentFn = makeFn(prevFn, currentFn);
            }
        }

        return currentFn;
    },

    sequenceAs: function (ctx) {
        return this.partial(this.sequence, ctx);
    },

    /*
     * Take a @fn {Function} and create a new function that flips its arguments
     * and applies them to itself.
     */
    flip: function (fn) {
        return function () {
            var args = List.asArray(arguments);
            var flipped = args.reverse();
            fn.apply(this, flipped);
        };
    },

    flipAs: function (ctx) {
        return this.partial(this.flip, ctx);
    },

    lookup: function (key, obj) {
        return obj[key];
    },

    /*
     * Allow us to call a constructor using Function.apply.
     * @args {Array}
     */
    newApply: function (constrFn, args) {
        function F() {
            return constrFn.apply(this, args);
        }
        F.prototype = constrFn.prototype;
        return new F();
    }
};

},{"./List.js":8}],5:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

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
    var a = this._a;
    return (a.length > 0) ? a[0] : undefined;
}

function last() {
    var a = this._a;
    return (a.length > 0) ? a[a.length - 1] : undefined;
}


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Standard Array API
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function concat() {
    var a = this._a;
    var args = slice.call(arguments);
    var arrays = args.map(function(arr) {
        return (arr instanceof ImmutableList) ? arr.toArray() : arr;
    });

    return new ImmutableList(a.concat.apply(a, arrays));
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
    var last = this.last();
    return [last, this.remove(last)];
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

function shift() {
    var first = this.first();
    return [first, this.remove(first)];
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
    var a = this._a.slice();

    // Passing insertItems will force an "undefined" array entry.
    if (insertItems === undefined) {
        a.splice(index, howMany);
    }
    else {
        a.splice(index, howMany, insertItems);
    }

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
    return new ImmutableList(args.concat(this.toArray()));
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

var listKeys = Object.keys(listAPI);
var arrayKeys = Object.keys(arrayAPI);
var utilKeys = Object.keys(utilAPI);


function ImmutableList(a) {

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
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// List API
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

listKeys.forEach(function (key) {
    ImmutableList.prototype[key] = listAPI[key];
}, this);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Array API
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

arrayKeys.forEach(function (key) {
    ImmutableList.prototype[key] = arrayAPI[key];
}, this);


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Util API
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

utilKeys.forEach(function (key) {
    ImmutableList.prototype[key] = utilAPI[key];
}, this);


module.exports = ImmutableList;

},{}],6:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Advice        = _dereq_('./Advice.js');
var Channel       = _dereq_('./Channel.js');
var Emitter       = _dereq_('./Emitter.js');
var Fn            = _dereq_('./Fn.js');
var ImmutableList = _dereq_('./ImmutableList.js');
var Lifecycle     = _dereq_('./Lifecycle.js');
var List          = _dereq_('./List.js');
var Obj           = _dereq_('./Obj.js');
var Queue         = _dereq_('./Queue.js');
var SortedTable   = _dereq_('./SortedTable.js');
var Subscription  = _dereq_('./Subscription.js');
var Table         = _dereq_('./Table.js');
var Type          = _dereq_('./Type.js');

module.exports = {
    Advice:  Advice,
    Channel: Channel,
    Emitter: Emitter,
    Fn: Fn,
    ImmutableList: ImmutableList,
    Lifecycle: Lifecycle,
    List: List,
    Obj: Obj,
    Queue: Queue,
    SortedTable: SortedTable,
    Subscription: Subscription,
    Table: Table,
    Type: Type
};

},{"./Advice.js":1,"./Channel.js":2,"./Emitter.js":3,"./Fn.js":4,"./ImmutableList.js":5,"./Lifecycle.js":7,"./List.js":8,"./Obj.js":9,"./Queue.js":10,"./SortedTable.js":11,"./Subscription.js":12,"./Table.js":13,"./Type.js":14}],7:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
 * A lifecycle object that can be used in asynchronous dependency management.
 */

function Lifecycle() {
    /** {=Map} */
    this.__listeners = {};

    /** {=Map} */
    this.__finishedEvents = {};
}

Lifecycle.prototype = {

    when: function (eventName, listener, scope) {
        var list = null;
        var entry = null;

        /*
         * If the event has already finished, call the listener
         * immediately.
         */
        if (!!this.__finishedEvents[eventName]) {
            return (scope) ?
                listener.call(scope) :
                listener();
        }

        list = this.__listeners[eventName] =
            this.__listeners[eventName] || [];

        entry[0] = listener;
        entry[1] = scope;

        list.push(entry);
    },

    /**
     * {boolean} Emit an event for @eventName {String}. Returns true
     * if the event was emitted successfully, otherwise returns false.
     * False indicates that the event has already been emitted in the
     * past.
     */
    emit: function (eventName) {
        var list = null;
        var entry = null;
        var listener = null;
        var scope = null;
        var i = 0;
        var l = 0;

        if (!!this.__finishedEvents[eventName]) {
            return false;
        }

        list = this.__listeners[eventName];

        if (!list) {
            return true;
        }

        for (i = 0, l = list.length; i < l; i += 1) {
            entry = list[i];
            listener = entry[0];
            scope = entry[1];

            (scope) ? listener.call(scope) : listener();
        }

        this.__listeners[eventName] = null;
        return true;
    }
};

module.exports = Lifecycle;

},{}],8:[function(_dereq_,module,exports){
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

},{}],9:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var Type = _dereq_('./Type.js');

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

},{"./Type.js":14}],10:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var List = _dereq_('./List.js');

/**
 * A basic queue implementation.
 *
 * NOTE: this queue does NOT enforce a fixed size. To create a queue with
 * additional functionality, mix this queue into another object that implements
 * the new fixed-size logic.
 */
function Queue() {
    this._queue = [];
    this._offset = 0;
}

Queue.prototype = {
    /**
     * Return the item at the front of the queue, but don't remove it.
     * If there is nothing, then return null.
     */
    peek: function () {
        var queue = this._queue;

        return (queue.length > 0) ? queue[this._offset] : null;
    },

    /**
     * Queue an item.
     */
    add: function (item) {
        return this._queue.push(item);
    },

    /**
     * Remove an item from the queue. Returns the removed item; otherwise
     * it returns null.
     */
    remove: function () {
        var queue = this._queue;
        var item = null;

        if ( queue.length === 0 ) {
            return null;
        }

        // Get the item at the front of the queue.
        item = queue[this._offset];

        // Increment the offset and remove the excess space if necessary.
        this._offset += 1;

        if ( (this._offset * 2) >= queue.length ) {
            this._queue = queue.slice(this._offset);
            this._offset = 0;
        }

        return item;
    },

    /**
     * {Integer} Return the length of the queue.
     */
    getLength: function () {
        return this._queue.length - this._offset;
    },

    isEmpty: function () {
        return this.getLength() === 0;
    },

    clear: function () {
        List.clear(this._queue);
        this._offset = 0;
    },

    toArray: function () {
        return this._queue.slice( this._offset );
    }
};

module.exports = Queue;

},{"./List.js":8}],11:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var listUtil = _dereq_('./List.js');
var Table = _dereq_('./Table.js');

function SortedTable() {
    Table.call(this);
}

SortedTable.prototype = Object.create(Table.prototype);

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

module.exports = SortedTable;

},{"./List.js":8,"./Table.js":13}],12:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function Subscription(target, clientId) {
    this._target = target;
    this._clientId = clientId;
    this._isActive = true;
}

Subscription.prototype = {

    cancel: function() {
        if (!this._isActive) {
            return;
        }

        this._target.unbind(this._clientId);
        this._isActive = false;
    }
};

module.exports = Subscription;

},{}],13:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var List = _dereq_('./List.js');

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


},{"./List.js":8}],14:[function(_dereq_,module,exports){
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 -2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var toStr = Object.prototype.toString;

function name(val) {
    return toStr.call(val).slice(8, -1);
}

/**
 * Library for checking object types.
 */
module.exports = {

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
};

},{}]},{},[6])
(6)
});
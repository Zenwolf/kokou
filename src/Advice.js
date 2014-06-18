/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var List = require('./List.js');

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

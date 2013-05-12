// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
 * A module for adding Aspect-Oriented advice for cross-cutting concerns.
 */
define(function () {

    var advice = {};
    var module = {};


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Advice mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asAdvice = (function () {

        function before(base, before) {
            return function composedBefore() {
                var args = Array.prototype.slice.call(arguments, 0);

                before.apply(this, args);

                return base.apply(this, args);
            };
        }

        function around(base, around) {
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
        }

        function after(base, after) {
            return function composedAfter() {
                var args = Array.prototype.slice.call(arguments, 0);
                var result = base.apply(this, args);

                after.apply(this, args)

                return result;
            };
        }

        return function () {
            this.before = before;
            this.around = around;
            this.after  = after;
        };
    } ());



    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototype object.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    asAdvice.call(advice);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public module.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.withAdvice = function () {
        ['before', 'around', 'after'].forEach(function (fnName) {

            this[fnName] = function (method, fn) {
                if ( typeof this[method] === 'function' ) {
                    return this[method] =
                        advice[fnName](this[method], fn);
                }
                else {
                    return this[method] = fn;
                }
            };

        }, this);
    };

    return module;
});

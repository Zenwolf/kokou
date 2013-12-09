/**
 *
 */
(function () {

var advice = {

    /**
     * @base {Function}, @before {Function}
     */
    before: function (base, before) {
        return function composedBefore() {
            var args = Array.prototype.slice.call(arguments, 0);

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
            var args = Array.prototype.slice.call(arguments, 0);
            var result = base.apply(this, args);

            after.apply(this, args);
            return result;
        };
    }
};

/**
 * A module for mixing-in Aspect-Oriented advice for cross-cutting concerns.
 */
core.Module('kokou.Advice', {

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

});

} ());

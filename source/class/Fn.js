/*
 * A utility to support functional programming.
 */
core.Module('kokou.Fn', {

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
        var asArray = kokou.List.asArray;
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
            return fn1( fn2.apply(ctx, kokou.List.asArray(arguments)) );
        };
    },

    composeAs: function (ctx) {
        return kokou.Fn.partial(kokou.Fn.compose, ctx);
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
        var l = 0;
        var ctx = this;

        var makeFlowFn = function (fn, nextFn, ctx) {
            var f = null;

            if (ctx) {
                f = function (error) {
                    fn.call(ctx, error, nextFn);
                };
            }
            else {
                f = function (error) {
                    fn(error, nextFn);
                };
            }

            return f;
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
        return kokou.Fn.partial(kokou.Fn.flow, ctx);
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
        var partial = kokou.Fn.partial;
        var compose = kokou.Fn.compose;
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
        return kokou.Fn.partial(kokou.Fn.sequence, ctx);
    },

    /*
     * Take a @fn {Function} and create a new function that flips its arguments
     * and applies them to itself.
     */
    flip: function (fn) {
        return function () {
            var args = kokou.List.asArray(arguments);
            var flipped = args.reverse();
            fn.apply(this, flipped);
        };
    },

    flipAs: function (ctx) {
        return kokou.Fn.partial(kokou.Fn.flip, ctx);
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
});

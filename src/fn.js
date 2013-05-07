/*
 * A utility to support functional programming.
 */
define(function () {
    var aSlice = Array.prototype.slice;
    var module = {};

    var op = {
        '+'  : function (a, b) { return a + b; },
        '-'  : function (a, b) { return a - b; },
        '*'  : function (a, b) { return a * b; },
        '/'  : function (a, b) { return a / b; },
        '===': function (a, b) { return a === b; },
        '%'  : function (a, b) { return a % b; },
        '<'  : function (a, b) { return a < b; },
        '>'  : function (a, b) { return a > b; },
        '!'  : function (a) { return !a; }
    };

    function partial(fn, ctx) {
        var args = aSlice.call(arguments, 2); // remove fx, ctx
        var newFn = null;
        ctx = ctx || null;

        newFn = function () {
            var localArgs = aSlice.call(arguments, 0);
            return fn.apply(ctx, args.concat(localArgs) );
        };

        return newFn;
    }

    /*
     * Return a new function that executes function 2 and passes its
     * return value to function 1. The returned function will do this:
     *   fn1( fn2(arguments) )
     */
    function compose(fn1, fn2) {
        var ctx = this;
        return function () {
            return fn1( fn2.apply(ctx, arguments) );
        };
    }

    function composeAs(ctx) {
        return partial(compose, ctx);
    }

    /*
     * Flow a series of functions via callbacks.
     *
     * WARNING: beware of overflowing the stack with a large array of
     * functions (due to no tail recursion in JS).
     */
    function flow(fns, last) {
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
    }

    function flowAs(ctx) {
        return partial(flow, ctx);
    }

    /*
     * Sequence an array of functions using partial application and
     * composition. The next function is always passed the return
     * value of the previous function. Returns the first function
     * in the sequence.
     */
    function sequence(fns) {
        var i = fns.length;
        var currentFn = null;
        var prevFn = null;
        var isLast = true;
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
    }

    function sequenceAs(ctx) {
        return partial(sequence, ctx);
    }

    function lookup(key, obj) {
        return obj[key];
    }

    /*
     * Allow us to call a constructor using Function.apply.
     * @args {Array}
     */
    function newApply(constrFn, args) {
        function F() {
            return constrFn.apply(this, args);
        }
        F.prototype = constrFn.prototype;
        return new F();
    }

    module.op         = op;
    module.partial    = partial;
    module.compose    = compose;
    module.composeAs  = composeAs;
    module.flow       = flow;
    module.flowAs     = flowAs;
    module.sequence   = sequence;
    module.sequenceAs = sequenceAs;
    module.lookup     = lookup;
    module.newApply   = newApply;
    module.isUndef    = partial(op['==='], null, undefined);
    module.isDef      = compose(op['!'], module.isUndef);

    return module;
});

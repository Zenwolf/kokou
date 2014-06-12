/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

(function (global) {

var kokou = global.kokou = (global.kokou || {});
var listUtil = kokou.List;

/**
 * A Channel used to keep track of a specific set of client IDs and listeners.
 */
function Channel() {
    this._listeners = new kokou.SortedTable();
}

Channel.prototype = {

    /**
     * Bind a @listener {Function} to a given @clientId {String},
     * with an optional @context {Object?}.
     */
    bind: function (clientId, listener, context) {
        this._listeners.put(clientId, [listener, context]);

        return new kokou.Subscription(this, clientId);
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

kokou.Channel = Channel;

} (this));

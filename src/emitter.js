/*
 * An event emitter.
 */
core.Class('kokou.Emitter', {

    construct: function () {
        this.__listeners = {};
    },

    members: {
        /**
         * Add a @listener {Function} for @eventName {String}
         * with @context {Object?} and whether or not it @isOnce {Boolean?}.
         */
        addListener: function (eventName, listener, context, isOnce) {
            var emitter = this;
            var listeners = this.__listeners;
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
            var listeners = this.__listeners[eventName];
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
            var listeners = this.__listeners[eventName];

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
            this.__listeners = {};
        }

        /**
         * {Array} Return a new array of the listeners
         * for @eventName {String}.
         */
        getListeners: function (eventName) {
            var listeners = this.__listeners[eventName];
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
            var listeners = this.__listeners[eventName];
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
    }
});

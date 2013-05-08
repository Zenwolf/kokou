// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
 * An event emitter.
 */
define(function () {

    var emitter = {};
    var module = {};

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Emitter mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asEmitter = (function () {
        /*
         * Init the object with expected properties.
         */
        function initEmitter() {
            var eData = null;

            this.data = this.data || {};
            eData = this.data['emitter'] = {};
            eData.listeners = {};

            return this;
        }

        /**
         * Add a @listener {Function} for @eventName {String}
         * with @context {Object?} and whether or not it @isOnce {Boolean?}.
         */
        function addListener(eventName, listener, context, isOnce) {
            var data = this.data['emitter'];
            var entry = [];

            context = context || null;

            if (typeof isOnce !== 'boolean') {
                isOnce = false;
            }

            if (typeof data.listeners[eventName] === 'undefined'){
                data.listeners[eventName] = [];
            }

            entry[0] = listener;
            entry[1] = context;
            entry[2] = isOnce; // if it should listen only once.

            data.listeners[eventName].push(entry);
        }

        /**
         * Remove a @listener {Function} for @eventName {String}
         * with @context {Object?} and whether or not it @isOnce {Boolean?}.
         */
        function removeListener(eventName, listener, context, isOnce) {
            var data = this.data['emitter'];
            var listeners = data.listeners[eventName];
            var entry = null;
            var i = 0;
            var l = 0;

            context = context || null;

            if (!listeners) {
                return;
            }

            if (typeof isOnce !== 'boolean') {
                isOnce = false;
            }

            l = listeners.length;

            for (; i < l; i += 1) {
                entry = listeners[i];

                if (entry[0] === listener
                    && entry[1] === context
                    && entry[2] === isOnce) {

                    listeners.splice(i, 1);
                    break;
                }
            }
        }

        function removeAllListeners(eventName) {
            var data = this.data['emitter'];
            var listeners = data.listeners[eventName];

            if (!listeners) {
                return;
            }

            // Clear array and prevent garbage collection.
            data.listeners[eventName].length = 0;
        }

        /**
         * {Array} Return a new array of the listeners
         * for @eventName {String}.
         */
        function getListeners(eventName) {
            var data = this.data['emitter'];
            var listeners = data.listeners[eventName];
            var copy = [];

            if (listeners && listeners.length > 0) {
                copy = listeners.slice(0);
            }

            return copy;
        }

        /**
         * Convenience function to add a one-time @listener {Function} for
         * @eventName {String} with @context {Object?}.
         */
        function once(eventName, listener, context) {
            this.addListener(eventName, listener, context, true);
        }

        /**
         * Emit an event with @eventName {String}, with support of up to
         * five arguments.
         */
        function emit(eventName, arg1, arg2, arg3, arg4, arg5) {
            var data = this.data['emitter'];
            var listeners = data.listeners[eventName];
            var listener = null;
            var i = 0;
            var l = 0;

            if (!listeners) {
                return;
            }

            // make a copy to protect against timing issues.
            listeners = listeners.slice(0);

            l = listeners.length;

            for (; i < l; i += 1){
                listener = listeners[i];

                /*
                 * If it should only be called once, then remove it
                 * from the original array.
                 */
                if (listener[2] === true) {
                    data.listeners[eventName].splice(i, 1);
                }

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

        return function () {
            this.initEmitter        = initEmitter;
            this.addListener        = addListener;
            this.removeListener     = removeListener;
            this.removeAllListeners = removeAllListeners;
            this.getListeners       = getListeners;
            this.once               = once;
            this.emit               = emit;
        };
    } ());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototypical object
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    asEmitter.call(emitter);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function create() {
        var obj = Object.create(emitter);
        return obj.initEmitter();
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public module.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.create    = create;
    module.asEmitter = asEmitter;

    return module;
});

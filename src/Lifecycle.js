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

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012 - 2014 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var List = require('./List.js');

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

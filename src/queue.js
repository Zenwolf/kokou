/**
 * A basic queue implementation.
 *
 * NOTE: this queue does NOT enforce a fixed size. To create a queue with
 * additional functionality, mix this queue into another class that implements
 * the new logic.
 */
core.Class('kokou.Queue', {

    construct: function () {
        this.__queue = [];
        this.__offset = 0;
    },

    members: {

        /**
         * Return the item at the front of the queue, but don't remove it.
         * If there is nothing, then return null.
         */
        peek: function () {
            var queue = this.__queue;

            return (queue.length > 0) ? queue[this.__offset] : null;
        },

        /**
         * Queue an item.
         */
        add: function (item) {
            return this.__queue.push(item);
        },

        /**
         * Remove an item from the queue. Returns the removed item; otherwise
         * it returns null.
         */
        remove: function () {
            var queue = this.__queue;
            var item = null;

            if ( queue.length === 0 ) {
                return null;
            }

            // Get the item at the front of the queue.
            item = queue[this.__offset];

            // Increment the offset and remove the excess space if necessary.
            this.__offset += 1;

            if ( (this.__offset * 2) >= queue.length ) {
                this.__queue = queue.slice(this.__offset);
                this.__offset = 0;
            }

            return item;
        },

        /**
         * {Integer} Return the length of the queue.
         */
        getLength: function () {
            return this.__queue.length - this.__offset;
        },

        isEmpty: function () {
            return this.getLength() === 0;
        },

        clear: function () {
            kokou.List.clear(this.__queue);
            this.__offset = 0;
        },

        toArray: function () {
            return this.__queue.slice( this.__offset );
        }
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Copyright 2012, 2013 Matthew Jaquish
// Licensed under The MIT License
// http://opensource.org/licenses/MIT
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

define(function () {

    var queue  = {};
    var module = {};


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Queue mixin.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    var asQueue = (function () {

        function initQueue(config) {
            config = config || {};

            this.data = this.data || {};
            this.data.queue  = config.queue  || [];
            this.data.offset = config.offset || 0;

            return this;
        }

        function peek() {
            var data = this.data;
            var queue = data.queue;
            return (queue.length > 0) ? queue[data.offset] : null ;
        }

        function add(item) {
            return this.data.queue.push(item);
        }

        function remove() {
            var data = this.data;
            var queue = data.queue;
            var item = null;

            if ( queue.length === 0 ) {
                return null;
            }

            // Get the item at the front of the queue.
            item = queue[data.offset];

            // Increment the offset and remove the excess space if necessary.
            data.offset += 1;

            if ( (data.offset * 2) >= queue.length ) {
                data.queue = queue.slice(data.offset);
                data.offset = 0;
            }

            return item;
        }

        function getLength() {
            var data = this.data;
            return data.queue.length - data.offset;
        }

        function isEmpty() {
            return this.getLength() === 0;
        }

        function clear() {
            var data = this.data;
            data.queue.length = 0;
            data.offset = 0;
        }

        function toArray() {
            var data = this.data;
            return data.queue.slice( data.offset );
        }

        return function () {
            this.initQueue = initQueue;
            this.peek      = peek;
            this.add       = add;
            this.remove    = remove;
            this.getLength = getLength;
            this.isEmpty   = isEmpty;
            this.clear     = clear;
            this.toArray   = toArray;
        };
    } ());


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Prototypical object.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    asQueue.call(queue);


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Factory.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function create(config) {
        var obj = Object.create(queue);

        config = ( typeof config === 'object' ) ? config : null ;

        if ( config !== null ) {
            obj.initQueue(config);
        }

        return obj;
    }


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Public module.
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    module.create  = create;
    module.asQueue = asQueue;

    return module;
});

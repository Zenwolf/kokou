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
            var qData = null;

            config = config || {};

            this.data = this.data || {};
            qData = this.data['queue'] = {};

            qData.queue  = config.queue  || [];
            qData.offset = config.offset || 0;

            return this;
        }

        function peek() {
            var qData = this.data['queue'];
            var queue = qData.queue;

            return (queue.length > 0) ? queue[qData.offset] : null ;
        }

        function add(item) {
            var qData = this.data['queue'];
            return qData.queue.push(item);
        }

        function remove() {
            var qData = this.data['queue'];
            var queue = qData.queue;
            var item = null;

            if ( queue.length === 0 ) {
                return null;
            }

            // Get the item at the front of the queue.
            item = queue[qData.offset];

            // Increment the offset and remove the excess space if necessary.
            qData.offset += 1;

            if ( (qData.offset * 2) >= queue.length ) {
                qData.queue = queue.slice(qData.offset);
                qData.offset = 0;
            }

            return item;
        }

        function getLength() {
            var qData = this.data['queue'];
            return qData.queue.length - qData.offset;
        }

        function isEmpty() {
            return this.getLength() === 0;
        }

        function clear() {
            var qData = this.data['queue'];
            qData.queue.length = 0;
            qData.offset = 0;
        }

        function toArray() {
            var qData = this.data['queue'];
            return qData.queue.slice( qData.offset );
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

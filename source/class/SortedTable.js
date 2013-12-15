/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Copyright 2012, 2013 Matthew Jaquish
Licensed under the Apache License, Version 2.0
http://www.apache.org/licenses/LICENSE-2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

core.Class('kokou.SortedTable', {

    include: [kokou.Table],

    construct: function () {},

    members: {
        /**
         *
         */
        put: function (key, value) {
            var data = this._data;
            var keys = this.keys;
            var index = -1;

            if ( !data.hasOwnProperty(key) ) {
                index = kokou.List.indexOf(key, keys);
                keys.splice(index, 0, key);
            }

            data[key] = value;
        },

        /**
         *
         */
        remove: function (key) {
            var data = this._data;
            var keys = this.keys;
            var index = -1;
            var removedVal;

            if ( !data.hasOwnProperty(key) ) {
                return;
            }

            removedVal = data[key];
            delete data[key];
            index = kokou.List.indexOf(key, keys);
            keys.splice(index, 1);

            return removedVal;
        }
    }
});

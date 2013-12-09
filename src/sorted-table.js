/**
 *
 */
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

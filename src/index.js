define(
    [
        './type',
        './queue',
        './emitter',
        './list',
        './table',
        './sorted-table',
        './fn'
    ],

    function (type, queue, emitter, list, table, sortedTable, fn) {
        return {
            type       : type,
            queue      : queue,
            emitter    : emitter,
            list       : list,
            table      : table,
            sortedTable: sortedTable,
            fn         : fn
        };
    }
);

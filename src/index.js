define(
    [ './type'
    , './queue'
    , './emitter'
    , './list'
    , './table'
    , './sorted-table'
    , './fn'
    , './advice'
    ],

    function (type, queue, emitter, list, table, sortedTable, fn, advice) {
        return {
            type       : type,
            queue      : queue,
            emitter    : emitter,
            list       : list,
            table      : table,
            sortedTable: sortedTable,
            fn         : fn,
            advice     : advice
        };
    }
);

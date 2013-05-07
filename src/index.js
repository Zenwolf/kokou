define(
    [
        './type',
        './queue',
        './emitter',
        './list',
        './table',
        './sorted-table'
    ],

    function (type, queue, emitter, list, table, sortedTable) {
        return {
            type       : type,
            queue      : queue,
            emitter    : emitter,
            list       : list,
            table      : table,
            sortedTable: sortedTable
        };
    }
);

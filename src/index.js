define(
	[
        './type',
        './queue',
		'./emitter'
	],

	function (type, queue, emitter) {
		return {
            type   : type,
            queue  : queue,
			emitter: emitter
		};
	}
);

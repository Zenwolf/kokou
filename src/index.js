define(
	[
        './type',
		'./emitter'
	],

	function (type, emitter) {
		return {
            type   : type,
			emitter: emitter
		};
	}
);

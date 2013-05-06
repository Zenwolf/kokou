/**
 * Library for checking object types.
 */
define(function () {

	var toStr = Object.prototype.toString;

	function isFunction(val) {
		return toStr.call(val).slice(8, -1) === 'Function';
	}

	function isArray(val) {
		return toStr.call(val).slice(8, -1) === 'Array';
	}

	function isObject(val) {
		return toStr.call(val).slice(8, -1) === 'Object';
	}

	function isString(val) {
		return toStr.call(val).slice(8, -1) === 'String';
	}

	function isNumber(val) {
		return toStr.call(val).slice(8, -1) === 'Number';
	}

	function isBoolean(val) {
		return toStr.call(val).slice(8, -1) === 'Boolean';
	}

	function isDate(val) {
		return toStr.call(val).slice(8, -1) === 'Date';
	}

	function isRegExp(val) {
		return toStr.call(val).slice(8, -1) === 'RegExp';
	}

	function isNull(val) {
		return toStr.call(val).slice(8, -1) === 'Null';
	}

	function isUndefined(val) {
		return toStr.call(val).slice(8, -1) === 'Undefined';
	}

	return {
		isFunction : isFunction,
		isArray    : isArray,
		isObject   : isObject,
		isString   : isString,
		isNumber   : isNumber,
		isBoolean  : isBoolean,
		isDate     : isDate,
		isRegExp   : isRegExp,
		isNull     : isNull,
		isUndefined: isUndefined
	};
});
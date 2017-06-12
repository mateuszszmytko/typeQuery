export function _Mixin(options) {
	return function(constructor:Function) {
		constructor['target'] = options.target;
		
		constructor.prototype.__mixinBefore = function() {

		}

	}
}

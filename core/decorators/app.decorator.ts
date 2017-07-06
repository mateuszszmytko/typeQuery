import { QueryItem } from '../../query/queryItem';

export function _App(options) {
	return function(constructor:Function) {

		constructor.prototype.__appMixins = function() {
			if(options.mixins) {
				for(let i=0; i<options.mixins.length;i++) {
					let _mixin = options.mixins[i];

					Object.getOwnPropertyNames(_mixin.prototype).forEach(name => {
						if(name != 'constructor')
							Object.getPrototypeOf(_mixin.prototype)[name] = _mixin.prototype[name];
					});
				}
			}
		}
		constructor.prototype.__pageDeclaration = function() {
			const pageName = document.querySelector('body').getAttribute('data-page');
			if(pageName && options.pages && options.pages[pageName]) {
				constructor.prototype.page =  new options.pages[pageName]();
			}
		}
		

		

		constructor.prototype.__appInit = function() {
			this.__appMixins();
			this.__pageDeclaration();
			this.onInit();

			if(this.page)
				this.page.onInit();

		}
	}
}
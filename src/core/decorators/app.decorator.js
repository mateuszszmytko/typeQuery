"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _App(options) {
    return function (constructor) {
        constructor.prototype.__appMixins = function () {
            if (options.mixins) {
                var _loop_1 = function (i) {
                    var _mixin = options.mixins[i];
                    Object.getOwnPropertyNames(_mixin.prototype).forEach(function (name) {
                        if (name == '__mixinBefore') {
                            _mixin.prototype[name]();
                        }
                        else if (name != 'constructor')
                            _mixin.target.prototype[name] = _mixin.prototype[name];
                    });
                };
                for (var i = 0; i < options.mixins.length; i++) {
                    _loop_1(i);
                }
            }
        };
        var pageName = document.querySelector('body').getAttribute('data-page');
        if (pageName && options.pages && options.pages[pageName]) {
            constructor.prototype.page = new options.pages[pageName]();
        }
        constructor.prototype.__appInit = function () {
            var css = document.querySelector('#rq-style');
            if (!css) {
                css = document.createElement("style");
                css.id = "rq-style";
                css.type = "text/css";
                document.head.appendChild(css);
            }
            this.__appMixins();
            this.onInit();
            if (this.page)
                this.page.onInit();
        };
    };
}
exports._App = _App;
//# sourceMappingURL=app.decorator.js.map
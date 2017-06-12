"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function _Mixin(options) {
    return function (constructor) {
        constructor['target'] = options.target;
        constructor.prototype.__mixinBefore = function () {
            if (options.style) {
                var css = document.querySelector('#rq-style');
                css.innerHTML += options.style;
            }
        };
    };
}
exports._Mixin = _Mixin;
//# sourceMappingURL=mixin.decorator.js.map
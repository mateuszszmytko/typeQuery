"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueryAttr = (function () {
    function QueryAttr(el, attrName) {
        var _this = this;
        this.el = el;
        this.attrName = attrName;
        this.toString = function () {
            return _this.value;
        };
    }
    Object.defineProperty(QueryAttr.prototype, "name", {
        get: function () {
            return this.attrName;
        },
        //setters/getters
        set: function (newName) {
            //old attrs value
            var v = this.value;
            //clear attr with old name
            this.el.removeAttribute(this.attrName);
            this.attrName = newName;
            this.value = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryAttr.prototype, "value", {
        get: function () {
            return this.el.getAttribute(this.attrName);
        },
        set: function (value) {
            this.el.setAttribute(this.attrName, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryAttr.prototype, "test", {
        get: function () {
            return {
                set: this.value
            };
        },
        enumerable: true,
        configurable: true
    });
    return QueryAttr;
}());
exports.QueryAttr = QueryAttr;
//# sourceMappingURL=queryAttr.js.map
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var queryItem_1 = require("../query/queryItem");
var qReverse = (function (_super) {
    __extends(qReverse, _super);
    function qReverse() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    qReverse.prototype.reverse = function () {
        this.element.innerHTML = this.element.innerHTML.split("").reverse().join("");
    };
    qReverse.prototype.reverse2 = function () {
        console.log('asd');
    };
    return qReverse;
}(queryItem_1.QueryItem));
qReverse.target = queryItem_1.QueryItem;
exports.qReverse = qReverse;
//# sourceMappingURL=reverse.addon.js.map
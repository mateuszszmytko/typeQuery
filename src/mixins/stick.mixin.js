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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mixin_decorator_1 = require("../core/decorators/mixin.decorator");
var stick_addon_1 = require("../addons/stick.addon");
var queryItem_1 = require("../query/queryItem");
var qStick = (function (_super) {
    __extends(qStick, _super);
    function qStick() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    qStick.prototype.stick = function (options) {
        this.define('stick', stick_addon_1.Stick, options);
    };
    return qStick;
}(queryItem_1.QueryItem));
qStick = __decorate([
    mixin_decorator_1._Mixin({
        target: queryItem_1.QueryItem,
        style: "\n\t\t.sticked {\n\t\t\tposition: fixed;\n\t\t\ttop: 0;\n\t\t}\n\t"
    })
], qStick);
exports.qStick = qStick;
//# sourceMappingURL=stick.mixin.js.map
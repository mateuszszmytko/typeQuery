"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Init(app) {
    var _app = new (app.bind.apply(app, [void 0].concat(app.prototype.modules)))();
    _app.__appInit();
}
exports.Init = Init;
//# sourceMappingURL=init.js.map
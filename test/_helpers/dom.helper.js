"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom = require("jsdom");
var JSDOM = jsdom.JSDOM;
var VirtualDOM = (function () {
    function VirtualDOM() {
        this.mainHtml = "\n\t\t<!DOCTYPE html>\n\t\t<head></head>\n\t\t<body data-page=\"index\">\n\t\t\t<main id=\"app\">\n\n\t\t\t</main>\n\t\t</body>\n\t";
        var JSDOM = jsdom.JSDOM, document = new JSDOM(this.mainHtml), window = document.window;
        global.document = window.document;
        global.window = window;
        window.console = global.console;
    }
    VirtualDOM.html = function (content) {
        this.isDefined();
        document.querySelector('#app').innerHTML = content;
    };
    VirtualDOM.isDefined = function () {
        if (this.singleton == undefined) {
            this.singleton = new VirtualDOM();
        }
    };
    return VirtualDOM;
}());
VirtualDOM.singleton = undefined;
exports.VirtualDOM = VirtualDOM;
//# sourceMappingURL=dom.helper.js.map
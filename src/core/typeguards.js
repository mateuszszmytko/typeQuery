"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isQueryItem(q) {
    return q.raw !== undefined;
}
exports.isQueryItem = isQueryItem;
function isQueryItemsList(q) {
    return q.queryItems !== undefined;
}
exports.isQueryItemsList = isQueryItemsList;
function isHTMLElement(e) {
    return e.nodeName !== undefined;
}
exports.isHTMLElement = isHTMLElement;
function isNodeListOf(n) {
    return typeof n.item === "function";
}
exports.isNodeListOf = isNodeListOf;
function isNodeList(n) {
    return typeof n.item === "function";
}
exports.isNodeList = isNodeList;
//# sourceMappingURL=typeguards.js.map
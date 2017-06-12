"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryItemsList_1 = require("./queryItemsList");
var typeguards_1 = require("../core/typeguards");
function Query(queryString) {
    var items;
    if (typeof queryString == 'string') {
        items = document.querySelectorAll(queryString);
    }
    else if (typeguards_1.isHTMLElement(queryString) || typeguards_1.isNodeList(queryString)) {
        items = queryString;
    }
    return new queryItemsList_1.QueryItemsList(items);
}
exports.Query = Query;
//# sourceMappingURL=query.js.map
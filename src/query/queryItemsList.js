"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryItem_1 = require("./queryItem");
var typeguards_1 = require("../core/typeguards");
var QueryItemsList = (function () {
    function QueryItemsList(items) {
        this.queryItems = [];
        if (typeguards_1.isHTMLElement(items)) {
            this.queryItems.push(new queryItem_1.QueryItem(items));
        }
        else {
            for (var i = 0; i < items.length; i++) {
                this.queryItems.push(new queryItem_1.QueryItem(items[i]));
            }
        }
    }
    Object.defineProperty(QueryItemsList.prototype, "count", {
        get: function () {
            return this.queryItems.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryItemsList.prototype, "first", {
        get: function () {
            return this.queryItems[0] ? this.queryItems[0] : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryItemsList.prototype, "last", {
        get: function () {
            return this.queryItems[0] ? this.queryItems[this.queryItems.length - 1] : undefined;
        },
        enumerable: true,
        configurable: true
    });
    QueryItemsList.prototype.single = function (filter) {
        var singleQ = undefined;
        this.each(function (q) {
            if (filter(q) == true) {
                singleQ = q;
                return false;
            }
        });
        return singleQ;
    };
    QueryItemsList.prototype.each = function (callback) {
        for (var i = 0; i < this.queryItems.length; i++) {
            if (callback(this.queryItems[i], i) == false) {
                break;
            }
        }
    };
    QueryItemsList.prototype.add = function (query) {
        var _this = this;
        if (typeof query == 'string') {
            var items = document.querySelectorAll(query);
            for (var i = 0; i < items.length; i++) {
                this.push(new queryItem_1.QueryItem(items[i]));
            }
        }
        else if (typeguards_1.isQueryItem(query)) {
            this.push(query);
        }
        else if (typeguards_1.isNodeListOf(query)) {
            for (var i = 0; i < query.length; i++) {
                this.push(new queryItem_1.QueryItem(query[i]));
            }
        }
        else if (typeguards_1.isHTMLElement(query)) {
            this.push(new queryItem_1.QueryItem(query));
        }
        else if (typeguards_1.isQueryItemsList(query)) {
            query.each(function (q) { return _this.push(q); });
        }
        return this;
    };
    QueryItemsList.prototype.push = function (qItem) {
        var duplicate = this.queryItems.filter(function (q) {
            if (qItem.element === q.element)
                return true;
        });
        duplicate.length == 0 ? this.queryItems.push(qItem) : null;
        return this;
    };
    /**
     * qDiv.filter(q => q.classList.contains('a'))
     */
    QueryItemsList.prototype.filter = function (func) {
        this.queryItems = this.queryItems.filter(func);
    };
    return QueryItemsList;
}());
exports.QueryItemsList = QueryItemsList;
//# sourceMappingURL=queryItemsList.js.map
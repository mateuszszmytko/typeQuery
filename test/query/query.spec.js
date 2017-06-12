"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var query_1 = require("../../src/query/query");
var queryItemsList_1 = require("../../src/query/queryItemsList");
var dom_helper_1 = require("../_helpers/dom.helper");
describe('Function Query(queryString:string)', function () {
    before(function () {
        dom_helper_1.VirtualDOM.html("\n\t\t\t<p>Just a simple paragraph.</p>\n\t\t");
    });
    it('Should return instance of QueryItemsList', function () {
        var testQuery = query_1.Query('p');
        chai_1.expect(testQuery).to.be.instanceof(queryItemsList_1.QueryItemsList);
    });
});
//# sourceMappingURL=query.spec.js.map
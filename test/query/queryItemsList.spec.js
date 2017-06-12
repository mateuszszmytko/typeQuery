"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var query_1 = require("../../src/query/query");
var dom_helper_1 = require("../_helpers/dom.helper");
describe.only('Class QueryItemsList(queryString:string, parent?:HTMLElement)', function () {
    dom_helper_1.VirtualDOM.html("\n\t\t<p>Just a simple paragraph.</p>\n\t\t<p>Just a simple paragraph.</p>\n\t\t<p>Just a simple paragraph.</p>\n\t\t<p class=\"test-one\">Just a simple paragraph with class.</p>\n\t\t<p class=\"test-two\">Just a simple paragraph with class.</p>\n\t\t<p class=\"test-two\">Just a simple paragraph with class2.</p>\n\t\t<p class=\"test-three\">Just a simple paragraph with class.</p>\n\t\t<p class=\"test-three\">Just a simple paragraph with class.</p>\n\t\t<p class=\"test-three\">Just a simple paragraph with class.</p>\n\t");
    before(function () {
    });
    it('Getter "first" should return first child of queryItems', function () {
        var testQuery = query_1.Query('p');
        chai_1.expect(testQuery.first).to.be.equal(testQuery.queryItems[0]);
    });
    it('In method "each", count of callbacks should be equals to getter "count".', function () {
        var testQuery = query_1.Query('p');
        var callbackTimes = 0;
        testQuery.each(function (item) {
            callbackTimes++;
        });
        chai_1.expect(callbackTimes).to.be.equal(testQuery.count);
    });
    it('Method "filter", should filter queryItems property.', function () {
        var testQuery = query_1.Query('p');
        testQuery.filter(function (q) { return q.class.contains('test-one'); });
        chai_1.expect(testQuery.count).to.be.equal(1);
    });
    it('Method "single", should return QueryItem instance.', function () {
        var testQuery = query_1.Query('p');
        var queryItem = testQuery.single(function (q) { return q.class.contains('test-one') == true; });
        console.log(queryItem);
        chai_1.expect(queryItem).to.be;
    });
    describe('Method add()', function () {
        var testQuery = query_1.Query('.test-one');
        it('Should ignore duplicate elements', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                testQuery.add('.test-one');
                chai_1.expect(testQuery.count).to.be.equal(1);
                return [2 /*return*/];
            });
        }); });
        it('Should take string as parametr', function () {
            testQuery.add('.test-two');
            chai_1.expect(testQuery.count).to.be.equal(3);
        });
        it('Should take HTMLElement as parametr', function () {
            testQuery.add(document.querySelector('.test-three'));
            chai_1.expect(testQuery.count).to.be.equal(4);
        });
        it('Should take NodeListOf as parametr', function () {
            testQuery.add(document.querySelectorAll('.test-three'));
            chai_1.expect(testQuery.count).to.be.equal(6);
        });
        it('Should take QueryItem as parametr', function () {
            testQuery.add(query_1.Query('p').first);
            chai_1.expect(testQuery.count).to.be.equal(7);
        });
        it('Should take QueryItemsList as parametr', function () {
            testQuery.add(query_1.Query('p'));
            chai_1.expect(testQuery.count).to.be.equal(9);
        });
    });
});
//# sourceMappingURL=queryItemsList.spec.js.map
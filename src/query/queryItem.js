"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryEvent_1 = require("./queryEvent");
var queryItemsList_1 = require("./queryItemsList");
var typeguards_1 = require("../core/typeguards");
var QueryStyle = (function () {
    function QueryStyle(_queryItem) {
        this._cssFuncs = [];
        this.queryItem = _queryItem;
    }
    Object.defineProperty(QueryStyle.prototype, "cssFuncs", {
        get: function () {
            return this._cssFuncs;
        },
        set: function (v) {
            this._cssFuncs = this._cssFuncs.concat(v);
        },
        enumerable: true,
        configurable: true
    });
    QueryStyle.prototype.add = function (func) {
        this.cssFuncs.push(func);
        this.update();
    };
    QueryStyle.prototype.update = function () {
        var cssElement = document.querySelector('#rq-style'), cssWrapper = this.wrapper, css = '';
        for (var _i = 0, _a = this.cssFuncs; _i < _a.length; _i++) {
            var s = _a[_i];
            css += s(this.queryItem);
        }
        while (css.indexOf('@query') != -1) {
            css = css.replace('@query', '[' + this.queryItem.unique + ']');
        }
        cssWrapper = cssWrapper.replace('put_style_here', css);
        if (cssElement.innerHTML.indexOf(cssWrapper) == -1) {
            this.clear();
            cssElement.innerHTML += cssWrapper;
        }
    };
    QueryStyle.prototype.refresh = function () {
        this.update();
    };
    QueryStyle.prototype.clear = function () {
        var cssElement = document.querySelector('#rq-style'), firstIndex = cssElement.innerHTML.indexOf('/*' + this.queryItem.unique + ' - begin*/'), lastIndex = cssElement.innerHTML.indexOf('/*' + this.queryItem.unique + ' - begin*/');
        if (firstIndex && lastIndex) {
            var css = cssElement.innerHTML.substr(firstIndex, lastIndex);
            cssElement.innerHTML = cssElement.innerHTML.replace(css, '');
        }
    };
    Object.defineProperty(QueryStyle.prototype, "wrapper", {
        get: function () {
            return "\n/*" + this.queryItem.unique + " - begin*/\nput_style_here\n/*" + this.queryItem.unique + " - end*/\n";
        },
        enumerable: true,
        configurable: true
    });
    return QueryStyle;
}());
exports.QueryStyle = QueryStyle;
var QueryItem = (function () {
    function QueryItem(_element) {
        this._element = _element;
        this.unique = '';
        this.events = [];
        this.addons = new Map();
    }
    Object.defineProperty(QueryItem.prototype, "element", {
        /**
         * Getting access to html element.
         *
         * @method element():HTMLElement returns html element.
         * @method raw():HTMLElement returns html element.
         *
         */
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryItem.prototype, "raw", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Managing attributes
     *
     * @method attr(attrName:string, attrValue?:string):string allows to
     * get and set html element's attributes.
     * @method data(dataName:string, attrValue?:string):string shorthand to
     * attr method, with "data-" attributes.
     */
    QueryItem.prototype.attr = function (attrName, attrValue) {
        if (attrValue)
            this._element.setAttribute(attrName, attrValue);
        return this._element.getAttribute(attrName);
    };
    QueryItem.prototype.removeAttr = function (attrName) {
        this._element.removeAttribute(attrName);
    };
    QueryItem.prototype.addAttr = function (attrName, attrValue) {
        return this.attr(attrName, attrValue);
    };
    QueryItem.prototype.data = function (dataName, attrValue) {
        return this.attr('data-' + dataName, attrValue);
    };
    Object.defineProperty(QueryItem.prototype, "class", {
        get: function () {
            return this._element.classList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryItem.prototype, "value", {
        get: function () {
            return this._element.value;
        },
        set: function (val) {
            this._element.value = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryItem.prototype, "style", {
        /**
         * Managing styles
         *
         * @method get style():CSSStyleDeclaration
         * @method styles(v:{[key:string]:styleFunc|string})
         *
         */
        get: function () {
            return this._element.style;
        },
        enumerable: true,
        configurable: true
    });
    //public event<K extends keyof HTMLElementEventMap>(eventType:K, eventListener:(e:HTMLElementEventMap[K]) => any, eventName?:string):QueryEvent;
    QueryItem.prototype.styles = function (v) {
        for (var rule in v) {
            var _rule = v[rule];
            this.style[rule] = typeof _rule == 'string' ? _rule : _rule(this);
        }
    };
    QueryItem.prototype.event = function (eventType, eventListener) {
        var qEvent = new queryEvent_1.QueryEvent(this._element, eventType, eventListener);
        this.events.push(qEvent);
        return qEvent;
    };
    QueryItem.prototype.getEvents = function (eventType) {
        return this.events.filter(function (qe) {
            return typeof qe.eventType == 'string' ? qe.eventType == eventType : qe.eventType.indexOf(eventType);
        });
    };
    QueryItem.prototype.removeEvents = function (eventType) {
        for (var i = 0; i < this.events.length; i++) {
            var qe = this.events[i];
            if (typeof qe.eventType == 'string' ? qe.eventType == eventType : qe.eventType.indexOf(eventType)) {
                qe.pauseEvent();
                this.events.splice(i);
            }
        }
    };
    QueryItem.prototype.removeEvent = function (queryEvent) {
        if (typeof queryEvent === 'string') {
            this.removeEvent(this.getEvents(queryEvent)[0]);
        }
        else {
            var index = this.events.indexOf(queryEvent);
            index >= 0 ? queryEvent.pauseEvent() && this.events.splice[index] : undefined;
        }
    };
    QueryItem.prototype.eventOnce = function (eventType, eventListener) {
        var _this = this;
        var onceEventListener = function (e) {
            eventListener(e);
            _this.removeEvent(qEvent);
        };
        var qEvent = this.event(eventType, onceEventListener);
        return qEvent;
    };
    QueryItem.prototype.asyncEvent = function (eventType, condition) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            var eventListener = function (e) {
                if (!condition || condition(e)) {
                    _this._element.removeEventListener(eventType, eventListener);
                    resolve(e);
                }
            };
            _this._element.addEventListener(eventType, eventListener);
        });
        return promise;
    };
    QueryItem.prototype.triggerEvent = function (eventType, detail) {
        if (detail === void 0) { detail = null; }
        var event = new CustomEvent(eventType, { detail: detail });
        this._element.dispatchEvent(event);
    };
    /**
     * Creating new instances.
     *
     * @method children(queryString?:string):QueryItemsList allows to get children
     * of html element as QueryItemsList.
     * @method child(queryString:string):QueryItem allows to get child of html element as QueryItem.
     * @method get parent():QueryItem allows to get parent of html element as QueryItem.
     */
    QueryItem.prototype.children = function (queryString) {
        var items = queryString ? this._element.querySelectorAll(queryString) : this._element.children;
        return new queryItemsList_1.QueryItemsList(items);
    };
    QueryItem.prototype.child = function (queryString) {
        return new QueryItem(this._element.querySelector(queryString));
    };
    Object.defineProperty(QueryItem.prototype, "parent", {
        get: function () {
            return new QueryItem(this._element.parentElement);
        },
        enumerable: true,
        configurable: true
    });
    QueryItem.prototype.clone = function (deep, copyEvents) {
        if (deep === void 0) { deep = false; }
        if (copyEvents === void 0) { copyEvents = false; }
        var clonedNode = this._element.cloneNode(deep);
        clonedNode.removeAttribute(this.unique);
        var clonedQuery = new QueryItem(clonedNode);
        clonedQuery.moveInto(document.querySelector('body'));
        if (copyEvents) {
            /*for(const ev of this.events) {
                clonedQuery.event(ev.eventName, ev.func);
            }*/
        }
        for (var key in this.addons.keys()) {
            var addon = this.addons.get(key);
            clonedQuery.define(key, addon.constructor, addon.options);
        }
        return clonedQuery;
    };
    /**
     * Addons managing
     *
     * @method define(addonString:string, addonItemCon:any, options?:any) allows to define new addon.
     * @method release(addonString:string) allows to destroy AddonItem.
     */
    QueryItem.prototype.define = function (addonString, addonItemCon, options) {
        console.log('defining rak');
        var _addonItem = this.addons.get(addonString);
        if (!_addonItem) {
            var addonItem = new addonItemCon(this, options);
            addonItem.onInit();
            this.addons.set(addonString, addonItem);
        }
    };
    QueryItem.prototype.release = function (addonString) {
        var addonItem = this.addons.get(addonString);
        if (addonItem) {
            addonItem.onDestroy();
            this.addons.delete(addonString);
        }
    };
    /**
     * Moving base element.
     *
     * @method move(target:HTMLElement|QueryItem, position:'beforebegin'|'afterbegin'|'beforeend'|'afterend' = 'beforebegin')
     * @method moveInto(target:HTMLElement|QueryItem)
     * @method moveBefore(target:HTMLElement|QueryItem)
     * @method moveAfter(target:HTMLElement|QueryItem)
     * @method moveUp() //todo zmienić nazwę
     *
     */
    QueryItem.prototype.move = function (target, position) {
        if (position === void 0) { position = 'beforebegin'; }
        if (typeguards_1.isQueryItem(target))
            target = target.element;
        target.insertAdjacentElement(position, this._element);
    };
    QueryItem.prototype.moveInto = function (target) {
        this.move(target, 'beforeend');
    };
    QueryItem.prototype.moveBefore = function (target) {
        console.log('move before');
        this.move(target, 'beforebegin');
    };
    QueryItem.prototype.moveAfter = function (target) {
        this.move(target, 'afterend');
    };
    QueryItem.prototype.moveUp = function () {
        this._element.parentElement.parentElement.insertBefore(this._element, this._element.parentElement);
    };
    QueryItem.prototype.detach = function () {
        this._element.parentNode.removeChild(this._element);
    };
    /**
     *
     * Append new elements.
     *
     * @method append(target:string | QueryItem | HTMLElement)
     * @method prepend(target:string | QueryItem | HTMLElement)
     */
    QueryItem.prototype.append = function (target, position) {
        if (position === void 0) { position = 'beforeend'; }
        if (typeof target == 'string') {
            this._element.insertAdjacentHTML(position, target);
        }
        else if (typeguards_1.isQueryItem(target)) {
            this._element.insertAdjacentElement(position, target.element);
        }
        else if (typeguards_1.isHTMLElement(target)) {
            this._element.insertAdjacentElement(position, target);
        }
    };
    QueryItem.prototype.prepend = function (target) {
        this.append(target, 'afterbegin');
    };
    Object.defineProperty(QueryItem.prototype, "offset", {
        /**
         * Helper methods
         */
        get: function () {
            var parent = this._element, item_offset = 0, offset = {
                top: 0,
                left: 0,
            };
            while (parent.offsetParent) {
                offset.top += parent.offsetTop;
                offset.left += parent.offsetLeft;
                parent = parent.offsetParent;
            }
            return offset;
        },
        enumerable: true,
        configurable: true
    });
    QueryItem.prototype.stopEvents = function () {
        /*for(let event of this.events) {
            event.stop();
        }
        this.events = [];*/
    };
    QueryItem.prototype.releaseAddons = function () {
        this.addons.forEach(function (a) {
            a.onDestroy();
        });
        this.addons.clear();
    };
    QueryItem.prototype.clearAll = function () {
        this.onDestroy();
    };
    QueryItem.prototype.remove = function () {
        this.onDestroy();
        this._element.parentElement.removeChild(this._element);
    };
    QueryItem.prototype.onDestroy = function () {
        this.stopEvents();
        this.releaseAddons();
    };
    return QueryItem;
}());
exports.QueryItem = QueryItem;
/*
appear (triggerowanie pojawiania się elementów)
animate.js?
tabs
modals

scrollto

 */ 
//# sourceMappingURL=queryItem.js.map
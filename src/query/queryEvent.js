"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EventState;
(function (EventState) {
    EventState[EventState["BEFORE_INIT"] = 0] = "BEFORE_INIT";
    EventState[EventState["ACTIVE"] = 1] = "ACTIVE";
    EventState[EventState["INACTIVE"] = 2] = "INACTIVE";
})(EventState || (EventState = {}));
var QueryEvent = (function () {
    function QueryEvent(el, _eventType, eventListener) {
        this.el = el;
        this._eventType = _eventType;
        this.eventListener = eventListener;
        this._state = EventState.BEFORE_INIT;
        if (this.eventListener)
            this.runEvent();
    }
    Object.defineProperty(QueryEvent.prototype, "state", {
        get: function () {
            return this._state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QueryEvent.prototype, "eventType", {
        get: function () {
            return this._eventType;
        },
        enumerable: true,
        configurable: true
    });
    QueryEvent.prototype.runEvent = function () {
        if (this.state == EventState.ACTIVE)
            return;
        if (typeof this.eventType === 'string') {
            this.el.addEventListener(this.eventType, this.eventListener);
        }
        else {
            for (var _i = 0, _a = this.eventType; _i < _a.length; _i++) {
                var eName = _a[_i];
                this.el.addEventListener(eName, this.eventListener);
            }
        }
        this._state = EventState.ACTIVE;
    };
    QueryEvent.prototype.changeEventType = function (eName) {
        this.pauseEvent();
        this._eventType = eName;
        this.runEvent();
    };
    QueryEvent.prototype.changeEventListener = function (_eventListener) {
        this.pauseEvent();
        this.eventListener = _eventListener;
        this.runEvent();
    };
    QueryEvent.prototype.pauseEvent = function () {
        if (this.state == EventState.INACTIVE)
            return;
        console.log('stopEvent');
        if (typeof this.eventType === 'string') {
            this.el.removeEventListener(this.eventType, this.eventListener);
        }
        else {
            for (var _i = 0, _a = this.eventType; _i < _a.length; _i++) {
                var eName = _a[_i];
                this.el.removeEventListener(eName, this.eventListener);
            }
        }
        this._state = EventState.INACTIVE;
        return this;
    };
    QueryEvent.prototype.resumeEvent = function () {
        this.runEvent();
    };
    return QueryEvent;
}());
exports.QueryEvent = QueryEvent;
//# sourceMappingURL=queryEvent.js.map
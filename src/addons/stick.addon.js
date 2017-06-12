"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryItem_1 = require("../query/queryItem");
var StickState;
(function (StickState) {
    StickState[StickState["NONE"] = 0] = "NONE";
    StickState[StickState["STICK"] = 1] = "STICK";
    StickState[StickState["UNSTICK"] = 2] = "UNSTICK";
})(StickState || (StickState = {}));
var Stick = (function () {
    function Stick(owner, options) {
        this.owner = owner;
        this.options = {
            offset: 0
        };
        if (options)
            for (var option in options) {
                this.options[option] = options[option];
            }
    }
    Stick.prototype.onInit = function () {
        var _this = this;
        console.log(this.owner);
        this.stickState = StickState.UNSTICK;
        //create parent wrapper
        var parentWrapper = document.createElement('div');
        this.qParent = new queryItem_1.QueryItem(parentWrapper);
        this.qParent.moveBefore(this.owner);
        this.qParent.class.add('sticky-wrapper');
        console.log(this.qParent.unique, this.qParent.element);
        //insert owner into parent wrapper
        this.owner.moveInto(parentWrapper);
        this.qParent.style.height = this.owner.raw.clientHeight + 'px';
        this.scroll(function () {
            _this.stickCheck();
        });
    };
    Stick.prototype.scroll = function (func) {
        this.scrollFunc = func;
        document.addEventListener('scroll', this.scrollFunc);
    };
    Stick.prototype.onDestroy = function () {
        if (this.stickState == StickState.STICK)
            this.stickRemove();
        document.removeEventListener('scroll', this.scrollFunc);
        this.owner.moveUp();
        this.qParent.remove();
    };
    Stick.prototype.stickCheck = function () {
        if (this.qParent.offset.top <= (window.pageYOffset + this.options.offset)
            && this.stickState == StickState.UNSTICK) {
            this.stickAdd();
        }
        else if (this.stickState == StickState.STICK
            && this.qParent.offset.top > (window.pageYOffset + this.options.offset)) {
            this.stickRemove();
        }
    };
    Stick.prototype.stickAdd = function () {
        this.owner.triggerEvent('stick', this.owner.raw);
        this.owner.class.add('sticked');
        this.owner.styles({
            'top': this.options.offset + 'px'
        });
        this.stickState = StickState.STICK;
    };
    Stick.prototype.stickRemove = function () {
        this.owner.triggerEvent('unstick', this.owner.raw);
        this.owner.class.remove('sticked');
        this.owner.style.top = '';
        this.stickState = StickState.UNSTICK;
    };
    return Stick;
}());
exports.Stick = Stick;
//# sourceMappingURL=stick.addon.js.map
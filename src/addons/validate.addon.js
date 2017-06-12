"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var query_1 = require("../query/query");
var queryItem_1 = require("../query/queryItem");
var Validate = (function () {
    function Validate(owner, validateOptions) {
        this.owner = owner;
        this.validateOptions = validateOptions;
        this.messages = {
            valueMissing: 'To pole jest wymagane.',
        };
        this.events = [];
    }
    Validate.prototype.onInit = function () {
        if (this.owner.element.nodeName !== "FORM") {
            throw new Error('Validate can be used only on forms.');
        }
        this.qInputs = this.owner.children('input');
        this.qSubmitBtn = query_1.Query('button:not([type=button]), input[type=submit]').first;
        this.eventsInit();
    };
    Validate.prototype.onDestroy = function () {
        for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            this.owner.removeEvent(event_1);
        }
        this.qInputs.each(function (qInput) {
            qInput.raw.removeChild(qInput.raw.querySelector('.error-message'));
        });
    };
    Validate.prototype.eventsInit = function () {
        var _this = this;
        var invalidEvent = this.owner.event('invalid', function (e) {
            e.preventDefault();
        });
        var submitEvent = this.qSubmitBtn.event('click', function (e) {
            _this.qInputs.each(function (qInput) {
                var inputElement = qInput.element, validationMessage = _this.getValidationMessage(inputElement);
                if (validationMessage) {
                    _this.owner.triggerEvent('formerror', {
                        input: inputElement,
                        error_message: validationMessage
                    });
                    _this.addErrorMessage(inputElement, validationMessage);
                    inputElement.parentElement.classList.add('error');
                    inputElement.focus();
                    e.preventDefault();
                    return false;
                }
            });
        });
        this.events.push(invalidEvent);
        this.events.push(submitEvent);
    };
    Validate.prototype.getValidationMessage = function (input) {
        var customValidation = this.getCustomValidation(input);
        for (var v in input.validity) {
            if (v == 'valid')
                continue;
            var valid = input.validity[v];
            if (input.validity[v])
                return customValidation && customValidation.messages && customValidation.messages[v]
                    ? customValidation.messages[v]
                    : this.messages[v] ? this.messages[v] : input.validationMessage;
        }
        if (customValidation != false && customValidation.steps.length > 0 &&
            !(input.value == '' && !input.getAttribute('required'))) {
            for (var i = 0; i < customValidation.steps.length; i++) {
                var regexp = new RegExp(customValidation.steps[i].regexp);
                if (regexp.test(input.value) === false) {
                    return customValidation.steps[i].message;
                }
            }
        }
        return null;
    };
    Validate.prototype.getCustomValidation = function (input) {
        for (var i = 0; i < this.validateOptions['customValidations'].length; i++) {
            var inputValidation = this.validateOptions['customValidations'][i];
            if (inputValidation.input == input)
                return inputValidation;
        }
        return false;
    };
    Validate.prototype.addErrorMessage = function (input, text) {
        var error_div = input.parentElement.querySelector('.error-message');
        if (!error_div) {
            var node = document.createElement('DIV');
            node.classList.add('error-message');
            error_div = input.parentElement.appendChild(node);
        }
        error_div.innerHTML = text;
    };
    return Validate;
}());
var qValidate = (function (_super) {
    __extends(qValidate, _super);
    function qValidate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    qValidate.prototype.validate = function (options) {
        this._validate = new Validate(this, options);
        this._validate.onInit();
    };
    return qValidate;
}(queryItem_1.QueryItem));
qValidate.target = queryItem_1.QueryItem;
exports.qValidate = qValidate;
//# sourceMappingURL=validate.addon.js.map
import { Query as q } from '../query/query';
import {QueryItem} from '../query/queryItem';
import {QueryItemsList} from '../query/queryItemsList';
import {QueryEvent} from '../query/queryEvent';


type ValidateOptions = {
	customValidations:Array<CustomValidation>;
}
type Messages = {[key: string]:string}

interface Step {
    regexp:RegExp;
    message:string;
}
interface CustomValidation {
    input:HTMLInputElement,
    steps?:Array<Step>;
    messages?:Messages;
}

class Validate {
    private validateDefaultOptions:ValidateOptions;
	private messages:Messages = {
        valueMissing: 'To pole jest wymagane.',       
    };
	
	private qInputs:QueryItemsList;
	private qSubmitBtn:QueryItem;

    private events:Array<QueryEvent> = [];


    constructor(public owner:QueryItem, public validateOptions:ValidateOptions) {

    }

    onInit() {
        if(this.owner.element.nodeName !== "FORM") {
            throw new Error('Validate can be used only on forms.');
        }
		this.qInputs = this.owner.children('input');
		this.qSubmitBtn = q('button:not([type=button]), input[type=submit]').first;

        this.eventsInit();
	}

    onDestroy() {
        for(let event of this.events) {
            this.owner.removeEvent(event);
        }

        this.qInputs.each((qInput) => {
            qInput.raw.removeChild(qInput.raw.querySelector('.error-message'));
        });
    }

	private eventsInit() {
		let invalidEvent = this.owner.event('invalid', (e) => {
			e.preventDefault();
		});

		let submitEvent = this.qSubmitBtn.event('click', (e) => {
			this.qInputs.each((qInput) => {
				let inputElement = <HTMLInputElement>qInput.element,
					validationMessage = this.getValidationMessage(inputElement);

				if(validationMessage) {
                    this.owner.triggerEvent('formerror',  {
                        input: inputElement,
                        error_message: validationMessage
                    });
                    
                    this.addErrorMessage(inputElement, validationMessage);
                    inputElement.parentElement.classList.add('error');
                    inputElement.focus();

                    e.preventDefault();
                    return false;
                }
			});
		});

        this.events.push(invalidEvent);
        this.events.push(submitEvent);
	}
	
	private getValidationMessage(input:HTMLInputElement):string {
		let customValidation = this.getCustomValidation(input);

        for(let v in input.validity) {
            if(v == 'valid')
                continue; 

            let valid = input.validity[v];
            if(input.validity[v])
                return customValidation && customValidation.messages && customValidation.messages[v] 
                ? customValidation.messages[v]
                : this.messages[v] ? this.messages[v] : input.validationMessage;

        }

        if(customValidation != false && customValidation.steps.length > 0 &&
           !(input.value == '' && !input.getAttribute('required'))) {

            for(let i=0;i<customValidation.steps.length;i++) {
                let regexp = new RegExp(customValidation.steps[i].regexp);
                if(regexp.test(input.value) === false) {
                    return customValidation.steps[i].message;
                }
            }
            
        }
        return null;
	}

	private getCustomValidation(input:HTMLInputElement) {
        for(let i=0;i<this.validateOptions['customValidations'].length;i++) {
            let inputValidation = this.validateOptions['customValidations'][i];
            if(inputValidation.input == input)
                return inputValidation;
        }
        return false;
    }

	private addErrorMessage(input, text) {

        let error_div:Element = input.parentElement.querySelector('.error-message');
        if(!error_div) {
            let node = document.createElement('DIV');
            node.classList.add('error-message');
            error_div = input.parentElement.appendChild(node);
        }
        error_div.innerHTML = text;
            
    }
}

export class qValidate extends QueryItem {
    private static target = QueryItem;
    private _validate:Validate;

	public validate(options:ValidateOptions) {
        this._validate = new Validate(this, options);
        this._validate.onInit();
	}
}
export class QueryAttr {
	constructor(private el:HTMLElement, private attrName:string) {}

	//setters/getters
	set name(newName:string) {
		//old attrs value
		let v = this.value;
		//clear attr with old name
		this.el.removeAttribute(this.attrName);
		this.attrName = newName;
		this.value = v;
	}
	get name() {
		return this.attrName;
	}
	set value(value:string) {
		this.el.setAttribute(this.attrName, value);
	}
	get value():string
	{
		return this.el.getAttribute(this.attrName);
	}

	get test():any {
		return {
			set: this.value
		}
	}

	public toString = () : string => {
        return this.value;
    }
	
}
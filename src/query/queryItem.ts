import {QueryAttr} from './queryAttr';
import {QueryEvent} from './queryEvent';
import {QueryItemsList} from './queryItemsList';

import { IAddon } from '../core/interfaces/addon.interface';

import { isQueryItem, isQueryItemsList, isHTMLElement, isNodeListOf } from '../core/typeguards';

type styleFunc = (qItem:QueryItem) => string;
type PartialCSSStyleDeclaration = {
    [P in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[P] | styleFunc;
}

interface IAddonConstructor<K> {
    new (owner:QueryItem, options?:any): K;
}

export class QueryItem {
	public events:Array<QueryEvent> = [];
	public addons:Array<IAddon> =[];

	constructor(private _element:HTMLElement) {
		
	}


	/**
	 * Getting access to html element.
	 * 
	 * @method element():HTMLElement returns html element.
	 * @method raw():HTMLElement returns html element.
	 * 
	 */
	public get element():HTMLElement {
		return this._element;
	}
	public get raw():HTMLElement {
		return this._element;
	}
	
	

	/**
	 * Managing attributes
	 * 
	 * @method attr(attrName:string, attrValue?:string):string allows to 
	 * get and set html element's attributes.
	 * @method data(dataName:string, attrValue?:string):string shorthand to
	 * attr method, with "data-" attributes. 
	 */
	public attr(attrName:string, attrValue?:string):string {
		if(attrValue)
			this._element.setAttribute(attrName, attrValue);

		return this._element.getAttribute(attrName);
	}
	public removeAttr(attrName:string):void {
		this._element.removeAttribute(attrName);
	}
	public addAttr(attrName:string, attrValue:string):string {
		return this.attr(attrName, attrValue);
	}
	public data(dataName:string, attrValue?:string):string {
		return this.attr('data-'+dataName, attrValue);
	}

	public get class():DOMTokenList {
		return this._element.classList;
	}
	
	public get value():any {
		return  (<HTMLInputElement>this._element).value;
	}

	public set value(val:any) {
		(<HTMLInputElement>this._element).value = val;
	}

	/**
	 * Managing styles
	 * 
	 * @method get style():CSSStyleDeclaration 
	 * @method styles(v:{[key:string]:styleFunc|string}) 
	 * 
	 */

	public get style():CSSStyleDeclaration {
		return this._element.style;
	}
	
	public  styles(v:PartialCSSStyleDeclaration) {
		for(let rule in v) {
			let _rule = v[rule];
			this.style[rule] = typeof _rule == 'string' ? _rule : _rule(this);
		}
	}



	/**
	 * Managing events
	 * 
	 * @method event(eventName:string, event?:(e:Event) => any):QueryEvent returns new QueryEvent instance
	 * allows to manage(run, stop, clear) event. Storing in events.
	 * @method triggerEvent(eventName:string, detail:any = null):void allows to trigger event.
	 * 
	 */
	public event<K extends keyof HTMLElementEventMap>(eventType:K, eventListener:(e:HTMLElementEventMap[K]) => any):QueryEvent;
	public event(eventType:string|Array<string>, eventListener:(e:CustomEvent)=> any):QueryEvent;
	public event(eventType, eventListener) {
		let qEvent = new QueryEvent(this._element, eventType, eventListener);
		this.events.push(qEvent);

		return qEvent;
	}
	
	public getEvents(eventType:string) {
		return this.events.filter(qe => {
			return typeof qe.eventType == 'string' ? qe.eventType == eventType : qe.eventType.indexOf(eventType);
		});

	}

	public removeEvents(eventType:string):void {

		for(let i = 0; i < this.events.length; i++) {
			let qe = this.events[i];
			if(typeof qe.eventType == 'string' ? qe.eventType == eventType : qe.eventType.indexOf(eventType)) {
				qe.pauseEvent();
				this.events.splice(i);
			}
		}
	}

	public removeEvent(queryEvent:QueryEvent|string):void {
		if(typeof queryEvent === 'string') {
			this.removeEvent(this.getEvents(queryEvent)[0]);
		} else {
			let index = this.events.indexOf(queryEvent);
			index >= 0? queryEvent.pauseEvent() && this.events.splice[index] : undefined;

		}
	}

	public eventOnce<K extends keyof HTMLElementEventMap>(eventType:K, eventListener:(e:HTMLElementEventMap[K]) => any):QueryEvent;
	public eventOnce(eventType:string|Array<string>, eventListener:(e:CustomEvent)=> any):QueryEvent;
	public eventOnce(eventType, eventListener) {
		
		let onceEventListener:EventListenerOrEventListenerObject = (e) => {
			eventListener(e);
			this.removeEvent(qEvent);
		}
		let qEvent = this.event(eventType, onceEventListener);
		return qEvent;
	}
	
	public asyncEvent<K extends keyof HTMLElementEventMap>(eventType:K, condition?:(e:HTMLElementEventMap[K]) => boolean):Promise<HTMLElementEventMap[K]>
	public asyncEvent(eventType:string, condition?:(e:CustomEvent) => boolean):Promise<CustomEvent>
	public asyncEvent<K extends keyof HTMLElementEventMap>(eventType, condition):Promise<CustomEvent> {

		let promise = new Promise<HTMLElementEventMap[K]|CustomEvent>((resolve, reject) => {
			let eventListener:EventListener = (e) => {
				if(!condition || condition(e)) {
					this._element.removeEventListener(eventType, eventListener);
					resolve(e);
				}
			}
			this._element.addEventListener(eventType, eventListener);

		});

		return promise;
		
	}
	public triggerEvent(eventType:string, detail:any = null):void {
		let event = new CustomEvent(eventType, {detail: detail});
		this._element.dispatchEvent(event);
	}

	

	/**
	 * @method children(queryString?:string):QueryItemsList allows to get children
	 * of html element as QueryItemsList.
	 */

	public children(queryString?:string):QueryItemsList {
		let _items = queryString ? this._element.querySelectorAll(queryString) : this._element.children,
			items:Array<HTMLElement> = [];
		for(let i = 0; i < _items.length; i++) {
			_items[i].parentElement == this.raw? items.push(<HTMLElement>_items[i]):null;
		}

		return new QueryItemsList(items);
	}

	/**
	 * @method find(queryString:string):QueryItemsList allows to get children
	 * of html element as QueryItemsList.
	 */
	public find(queryString:string):QueryItemsList {
		let items = this._element.querySelectorAll(queryString);

		return new QueryItemsList(items);
	}

	/**
	 * @method child(queryString:string):QueryItem allows to get child of html element as QueryItem.
	 */
	public child(queryString:string):QueryItem {
		return new QueryItem(<HTMLElement>this._element.querySelector(queryString));
	}

	/**
	 * @method get parent():QueryItem allows to get parent of html element as QueryItem.
	 */
	public get parent():QueryItem {
		return new QueryItem(<HTMLElement>this._element.parentElement);
	}

	public clone(deep:boolean = false, copyEvents:boolean = false):QueryItem {
		const clonedNode = <HTMLElement>this._element.cloneNode(deep);

		const clonedQuery = new QueryItem(clonedNode);
		
		clonedQuery.moveInto(document.querySelector('body'));


		if(copyEvents) {
			/*for(const ev of this.events) {
				clonedQuery.event(ev.eventName, ev.func);
			}*/
		}


		for(let key in this.addons.keys()) {
			let addon = this.addons[key];
			clonedQuery.define(addon.constructor, addon.options);
		}

		return clonedQuery;
	}

	
	

	/**
	 * Addons managing
	 * 
	 * @method define(addonString:string, addonItemCon:any, options?:any) allows to define new addon.
	 * @method release(addonString:string) allows to destroy AddonItem.
	 */

	public define<K extends IAddon>(addonItemCon:IAddonConstructor<K>, options?:any):K {
		let _addonItem = this.addons.filter(a => Object.getPrototypeOf(a).constructor == addonItemCon)[0];
		if(!_addonItem) {
			_addonItem = new addonItemCon(this, options);
			this.addons.push(_addonItem);
			_addonItem.onInit();
		}

		return _addonItem as K;
	}
	
	public release(addonItemCon:IAddonConstructor<IAddon>):void {
		let _addonItem = this.addons.filter(a => Object.getPrototypeOf(a).constructor == addonItemCon)[0];

		if(_addonItem) {
			this.addons.splice(this.addons.indexOf(_addonItem), 1);
			_addonItem.onDestroy();
		}
	}

	public addon<K extends IAddon>(addonItemCon:IAddonConstructor<K>):K {
		return this.addons.filter(a => Object.getPrototypeOf(a).constructor == addonItemCon)[0] as K;
	}

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

	public move(target:HTMLElement|QueryItem, position:'beforebegin'|'afterbegin'|'beforeend'|'afterend' = 'beforebegin') {
		if(isQueryItem(target))
			target = target.element;

		target.insertAdjacentElement(position, this._element);
	}
	public moveInto(target:HTMLElement|QueryItem):void {
		this.move(target, 'beforeend');
	}

	public moveBefore(target:HTMLElement|QueryItem):void {
		this.move(target, 'beforebegin');
	}

	public moveAfter(target:HTMLElement|QueryItem):void {
		this.move(target, 'afterend');
	}

	public moveUp():void {
		this._element.parentElement.parentElement.insertBefore(this._element, this._element.parentElement);
	}

	public detach():void {
		this._element.parentNode.removeChild(this._element);
	}

	/**
	 * 
	 * Append new elements.
	 * 
	 * @method append(target:string | QueryItem | HTMLElement)
	 * @method prepend(target:string | QueryItem | HTMLElement)
	 */

	 public append(target:string | QueryItem | HTMLElement, position:'beforebegin'|'afterbegin'|'beforeend'|'afterend' = 'beforeend'):HTMLElement {
		 if(typeof target === 'string') {
			 let element = document.createElement('div');
			 element.innerHTML = target;
			 return <HTMLElement>this._element.insertAdjacentElement(position, <HTMLElement>element.firstChild);
		 } else if(isQueryItem(target)) {
			 return <HTMLElement>this._element.insertAdjacentElement(position, target.element);
		 } else if(isHTMLElement(target)) {
			 return <HTMLElement>this._element.insertAdjacentElement(position, target);
		 }


	 }

	 public prepend(target:string | QueryItem | HTMLElement):HTMLElement {
		 return this.append(target, 'afterbegin');
	 }


	/**
	 * Helper methods
	 */
	public get offset():{top:number, left:number} {
		let parent = this._element,
			item_offset:number = 0,
			offset = {
				top: 0,
				left: 0,
			};

		while(parent.offsetParent) {
			offset.top += parent.offsetTop;
			offset.left += parent.offsetLeft;
			parent = <HTMLElement>parent.offsetParent;
		}
		return offset;
	}

	public stopEvents() {
		for(let event of this.events) {
			event.pauseEvent();
		}
		this.events = [];
	}
	public releaseAddons() {
		this.addons.forEach(a => {
			a.onDestroy();
		});
		this.addons = [];
	}

	public clear() {
		this.onDestroy();
	}

	public remove() {
		this.onDestroy();
		this._element.parentElement.removeChild(this._element);
	}
	
	private onDestroy() {
		this.stopEvents();
		this.releaseAddons();
	}

}


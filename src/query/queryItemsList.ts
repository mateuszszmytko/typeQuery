import {QueryAttr} from './queryAttr';
import { QueryItem } from './queryItem';
import { isQueryItem, isQueryItemsList, isHTMLElement, isNodeListOf } from '../core/typeguards';

export class QueryItemsList {
	queryItems:Array<QueryItem> = [];
	public get count():number {
		return this.queryItems.length;
	}
	public get first():QueryItem {
		return this.queryItems[0] ? this.queryItems[0] : undefined;
	}

	public get last():QueryItem {
		return this.queryItems[0] ? this.queryItems[this.queryItems.length-1] : undefined;
	}
	public single(filter:(qItem:QueryItem) => any):QueryItem {
		let singleQ = undefined;
		this.each((q) => {
			if(filter(q) == true) {
				singleQ = q;
				return false;
			}
		});

		return singleQ;
	}

	constructor(items:NodeList|HTMLElement) {	
		if(isHTMLElement(items)) {
			this.queryItems.push(new QueryItem(<HTMLElement>items));
		} else {
			for(let i = 0; i<items.length; i++) {
				this.queryItems.push(new QueryItem(<HTMLElement>items[i]));
			}
		}
		
	}

	public each(callback:(qItem:QueryItem, index?:number) => any):void {
		for(let i = 0; i<this.queryItems.length; i++) {
			if(callback(this.queryItems[i], i) == false) {
				break;
			}
		}
	}
	public add(query:String|QueryItem|QueryItemsList|Element|NodeList) {
		if(typeof query == 'string') {
			let items = document.querySelectorAll(query);
			for(let i = 0; i<items.length; i++) {
				this.push(new QueryItem(<HTMLElement>items[i]));
			}
		} else if(isQueryItem(query)) {
			this.push(query);
		} else if(isNodeListOf(query)) {
			for(let i = 0; i<query.length; i++) {
				this.push(new QueryItem(<HTMLElement>query[i]));
			}
		} else if(isHTMLElement(query)) {
			this.push(new QueryItem(query));
		} else if(isQueryItemsList(query)) {
			query.each(q => this.push(q));
		}

		return this;
	}

	public push(qItem:QueryItem) {
		let duplicate = this.queryItems.filter((q) => {
			if(qItem.element === q.element)
				return true;
		});
		duplicate.length == 0 ? this.queryItems.push(qItem) : null;

		return this;
	}
	/**
	 * qDiv.filter(q => q.classList.contains('a'))
	 */
	public filter(func:(q:QueryItem) => boolean) {
		this.queryItems = this.queryItems.filter(func);
	}

}
import { QueryItemsList } from './queryItemsList';
import { QueryItem } from './queryItem';
import { isQueryItem, isQueryItemsList, isHTMLElement, isNodeList } from '../core/typeguards';

export function Query(queryString:HTMLElement):QueryItem
export function Query(queryString?:string|HTMLElement|NodeList):QueryItemsList
export function Query(queryString) {
	if(!queryString) {
		return new QueryItemsList();
	} else if(typeof queryString == 'string') {
		let items = document.querySelectorAll(queryString);
		return  new QueryItemsList(items)
	} else if(isNodeList(queryString)) {
		return new QueryItemsList(queryString)
	} else if(isHTMLElement(queryString)) {
		return new QueryItem(queryString) ;
	}
}














import { QueryItemsList } from './queryItemsList';
import { QueryItem } from './queryItem';
import { isQueryItem, isQueryItemsList, isHTMLElement, isNodeList } from '../core/typeguards';

export function Query(queryString:string|HTMLElement|NodeList):QueryItemsList {
	let items:NodeList|HTMLElement;
	if(typeof queryString == 'string') {
		items = document.querySelectorAll(queryString);
	} else if(isHTMLElement(queryString) || isNodeList(queryString)) {
		items = queryString;
	}
	
	return new QueryItemsList(items);
}














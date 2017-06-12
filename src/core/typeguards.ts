import { QueryItemsList } from '../query/queryItemsList';
import { QueryItem } from '../query/queryItem';

export function isQueryItem(q:any): q is QueryItem {
	return (<QueryItem>q).raw !== undefined;
}

export function isQueryItemsList(q:any): q is QueryItemsList {
	return (<QueryItemsList>q).queryItems !== undefined;
}

export function isHTMLElement(e:any): e is HTMLElement {
	return (<HTMLElement>e).nodeName !== undefined;
}

export function isNodeListOf(n:any): n is NodeListOf<Element> {
	return typeof (<NodeListOf<Element>>n).item === "function";
}

export function isNodeList(n:any): n is NodeListOf<Element> {
	return typeof (<NodeListOf<Element>>n).item === "function";
}
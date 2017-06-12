export interface IAddon {
	options:any;
	onInit:() => void;
	onDestroy:() => void;
}

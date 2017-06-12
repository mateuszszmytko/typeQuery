
export function Init(app:any) {
	
	let _app = new app(...app.prototype.modules);
	_app.__appInit();
}
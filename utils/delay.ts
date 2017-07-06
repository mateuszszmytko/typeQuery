export function delay(time:number):Promise<any> {
	return new Promise(r => setTimeout(()=>r(), time));
}
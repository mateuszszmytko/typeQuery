const jsdom = require("jsdom");
const { JSDOM } = jsdom;

declare const global;

export class VirtualDOM {
	private dom;
	private mainHtml:string = `
		<!DOCTYPE html>
		<head></head>
		<body data-page="index">
			<main id="app">

			</main>
		</body>
	`;
	private static singleton:VirtualDOM = undefined;
	private constructor() {
		const { JSDOM } = jsdom,
			  	document = new JSDOM(this.mainHtml),
		 		window = document.window;

		global.document = window.document;
		global.window = window;
		window.console = global.console;

	}
	static html(content:string) {
		this.isDefined();

		document.querySelector('#app').innerHTML = content;
	}

	private static isDefined() {
		if(this.singleton == undefined) {
			this.singleton = new VirtualDOM();
		}
	}
}


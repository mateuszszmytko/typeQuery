import { QueryItem } from '../query/queryItem';
import { isHTMLElement, isQueryItem } from '../core/typeguards';
type easingType = 'easeInQuad' | 'easeOutQuad' | 'easeInOutQuad' | 'easeInCubic' | 'easeOutCubic' | 'easeInOutCubic' | 'easeInQuart' | 'easeOutQuart' | 'easeInOutQuart' | 'easeInQuint' | 'easeOutQuint' | 'easeInOutQuint';
type scrollOptions = {
	speed?:number,
	offset?:number,
	easing?:easingType
}

export async function scrollTo(target:string|number|QueryItem|HTMLElement, options?:scrollOptions) {
	let endLocation:number;
	if(typeof target == 'number') {
		endLocation = target;
	} else if(typeof target == 'string') {
		endLocation = new QueryItem(<HTMLElement>document.querySelector(target)).offset.top;
	} else if(isQueryItem(target)) {
		endLocation = target.offset.top;
	} else if(isHTMLElement(target)) {
		endLocation = new QueryItem(target).offset.top;
	}
	let scroll = new _scrollTo(endLocation, options);
	return scroll.startAnimateScroll();
}

class _scrollTo {
	private options:scrollOptions = {
		speed: 500,
		offset: 0,
		easing: 'easeInOutCubic',
	}
	private animationInterval:any;
	private easingType:string;

	private timeLapsed = 0;
	private startLocation = 0;
	private distance = 0;
	constructor(private endLocation:number, options?:scrollOptions) {
		for(let o in options)
			this.options[o] = options[o];
		
	}

	startAnimateScroll():Promise<any> {
		this.startLocation = window.pageYOffset;
		this.endLocation -= this.options.offset;
		this.distance = this.endLocation  - this.startLocation;
		let p = new Promise(resolve => {
			this.animationInterval = setInterval(() => {
				this.timeLapsed += 16;
				let percentage = ( this.timeLapsed / this.options.speed );
				percentage = ( percentage > 1 ) ? 1 : percentage;
				let position = Math.floor(this.startLocation + ( this.distance * this.easing( percentage) ));
				
				window.scrollTo(0, position);
				var currentLocation = window.pageYOffset;
				if ( currentLocation == this.endLocation || percentage == 1  || ( (window.innerHeight + currentLocation) >= document.body.scrollHeight ) ) {
					clearInterval(this.animationInterval);
					resolve();
				}
			}, 16);
		})
		

		return p;
	}



	private easing(time:number) {
		let pattern;
		// 
		switch(this.options.easing) {
			case 'easeInQuad':
				pattern = time * time;
				break;
			case 'easeOutQuad':
				pattern = time * (2 - time);
				break;
			case 'easeInOutQuad':
				pattern = pattern = time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time;
				break;
			case 'easeInCubic':
				pattern = time * time * time;
				break;
			case 'easeOutCubic':
				pattern = (--time) * time * time + 1;
				break;
			case 'easeInOutCubic':
				pattern = time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1;
				break;
			case 'easeInQuart':
				pattern = time * time * time * time;
				break;
			case 'easeOutQuart':
				pattern = 1 - (--time) * time * time * time;
				break;
			case 'easeInOutQuart':
				pattern = time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time;
				break;
			case 'easeInQuint':
				pattern = time * time * time * time * time;
				break;
			case 'easeOutQuint':
				pattern = 1 + (--time) * time * time * time * time;
				break;
			case 'easeInOutQuint':
				pattern = time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time;
				break;	
			
		}

		return pattern;
	}


}


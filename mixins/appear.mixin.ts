import { IMixin } from '../core/interfaces/mixin.interface';

import {QueryItem} from '../query/queryItem';

export enum AppearState {
	onScreen,
	offScreen
}

export interface AppearOptions {
	offsetTop?:number;
	offsetBottom?:number;
}


export class qAppear extends QueryItem implements IMixin {
	private _appearState:AppearState;

	public get appearState():AppearState {
		return this._appearState;
	}

	public asyncAppear(_options?:AppearOptions):Promise<any> {
		const promise = new Promise(r => {
			this.eventOnce('appear', e => {
				r();
			});
		})
		this.appearOnce(_options);

		return promise;
	}
	public asyncDisappear(_options?:AppearOptions):Promise<any> {
		const promise = new Promise(r => {
			this.eventOnce('disappear', e => {
				r();
			});
		})
		this.appear(_options);

		return promise;
	}

	public appearOnce(_options?:AppearOptions) {
		const scrollEvent = () => {
			let isAppeared = this.isAppeared(_options);
			if(isAppeared) {
				this.triggerEvent('appear');
				document.removeEventListener('scroll', scrollEvent);
			} 
		}

		document.addEventListener('scroll', scrollEvent);
		scrollEvent();
	}


    public appear(_options?:AppearOptions) {
		this._appearState = undefined;

		const scrollEvent = () => {
			let isAppeared = this.isAppeared(_options);
			if(isAppeared && this._appearState !== AppearState.onScreen) {
				this._appearState = AppearState.onScreen;
				this.triggerEvent('appear');
			} else if(!isAppeared && this._appearState === AppearState.onScreen) {
				this._appearState = AppearState.offScreen;
				this.triggerEvent('disappear');
			}
		}

		document.addEventListener('scroll', scrollEvent);
		scrollEvent();
	}

	isAppeared(_options?:AppearOptions):boolean {
		let options:AppearOptions = {
				offsetTop: 0,
				offsetBottom: 0	
			};

		for(const o in _options)
			options[o] = _options[o];

		const startPosition = this.offset.top + options.offsetTop,
			  endPosition = this.offset.top + this.raw.offsetHeight - options.offsetBottom,
			  currentPosition = window.pageYOffset,
			  currentEndPosition = currentPosition + window.innerHeight;

		return startPosition <= currentEndPosition && endPosition >= currentPosition;

	}


}
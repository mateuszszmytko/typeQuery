import { IMixin } from '../core/interfaces/mixin.interface';

import {QueryItem} from '../query/queryItem';
import {qAppear, AppearOptions} from './appear.mixin';
import {qAnimate, qAnimateType} from './animate.mixin';

import { delay } from '../utils/delay';

export interface RevealOptions extends AppearOptions {
	repeat?: boolean;
	enterAnimation?:qAnimateType;
	exitAnimation?:qAnimateType;
	delay?:number;
}

export class qReveal extends QueryItem implements IMixin {
	reveal(_options?:RevealOptions) {
		if(!(<any>this).animate) {
			throw new Error('Animate mixin is required to use reveal mixin.')
		}
		if(!(<any>this).appear) {
			throw new Error('Appear mixin is required to use reveal mixin.')
		}
		
		let options:RevealOptions = {
			offsetTop: 0,
			offsetBottom: 0,
			repeat: true,
			enterAnimation: "fadeIn",
			exitAnimation: "fadeOut",
			delay: 0
		};
		for(let o in _options) 
			options[o] = _options[o];

		if(options.repeat) {
			this.event('appear', async e => {
				if(options.delay > 0) {
					await delay(options.delay);
					if(!(<any>this).isAppeared(_options)) {
						return;
					}
				}
				
				await (<any>this).asyncAnimate(options.enterAnimation);
				this.style.opacity = "1";
			});
			
			this.event('disappear', async e => {
				if(options.delay > 0) {
					await delay(options.delay);
					if((<any>this).isAppeared(_options)) {
						return;
					}
				}
					
				await (<any>this).asyncAnimate(options.exitAnimation);
				this.style.opacity = "0";
			});

			(<any>this).appear(options);
		} else {
			this.eventOnce('appear', async e => {
				if(options.delay > 0) {
					await delay(options.delay);
					if(!(<any>this).isAppeared(_options)) {
						return;
					}
				}
					
				await (<any>this).asyncAnimate(options.enterAnimation);
			});

			(<any>this).appearOnce(options);

		}
		

	}
}
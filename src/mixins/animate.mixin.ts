import { IMixin } from '../core/interfaces/mixin.interface';
import {_Mixin} from '../core/decorators/mixin.decorator';
import { IAddon } from '../core/interfaces/addon.interface';

import {QueryItem} from '../query/queryItem';
import {QueryEvent} from '../query/queryEvent';

import '../styles/animate.mixin.scss';

export type qAnimateType = 
"fadeIn" |
"fadeInDown" |
"fadeInDownBig" |
"fadeInLeft" |
"fadeInLeftBig" |
"fadeInRight" |
"fadeInRightBig" |
"fadeInUp" |
"fadeInUpBig" |
"fadeOut" |
"fadeOutDown" |
"fadeOutDownBig" |
"fadeOutLeft" |
"fadeOutLeftBig" |
"fadeOutRight" |
"fadeOutRightBig" |
"fadeOutUp" |
"fadeOutUpBig" |
"rotateIn" |
"rotateInDownLeft" |
"rotateInDownRight" |
"rotateInUpLeft" |
"rotateInUpRight" |
"rotateOut" |
"rotateOutDownLeft" |
"rotateOutDownRight" |
"rotateOutUpLeft" |
"rotateOutUpRight" |
"zoomIn" |
"zoomInDown" |
"zoomInLeft" |
"zoomInRight" |
"zoomInUp" |
"zoomOut" |
"zoomOutDown" |
"zoomOutLeft" |
"zoomOutRight" |
"zoomOutUp";

export class qAnimate extends QueryItem implements IMixin {

	animate(animType:qAnimateType, short:boolean = false, infinite:boolean = false) {
		this.class.add('animated');

		//clear all animations
		let classes = this.raw.className.split(" ").filter(function(c) {
			return c.lastIndexOf('qAnim-', 0) !== 0;
		});
		this.raw.className = classes.join(" ").trim();

		this.class.add('qAnim-'+animType);
		infinite? this.class.add('infinite'): null;
		short? this.class.add('short'): null;
		if(!infinite) {
			this.eventOnce(['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend'], (e) => {
				this.class.remove('qAnim-'+animType);
				this.triggerEvent('qAnimEnd', {animType:animType});
			});
		}

	}

	async asyncAnimate(animType:qAnimateType, short:boolean = false):Promise<qAnimateType> {
		const animPromise = new Promise<qAnimateType>(resolve => {
			this.eventOnce('qAnimEnd', () => {
				resolve();
			});
		});
		this.animate(animType, short, false);

		return animPromise;
		
	}
}


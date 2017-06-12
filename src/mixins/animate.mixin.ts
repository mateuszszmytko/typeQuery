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

	animate(animType:qAnimateType, infinite:boolean = false) {
		if(this.class.contains('animated'))
			return;
		
		this.class.add('animated');
		this.class.add(animType);
		if(infinite) {
			this.class.add('infinite');
		} else {
			this.eventOnce(['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend'], (e) => {
				if(this.class.contains(animType)){
					this.triggerEvent('qAnimEnd', {animType:animType});
					this.class.remove('animated');
					this.class.remove(animType);
				}
			});
		}

	}

	async asyncAnimate(animType:qAnimateType):Promise<qAnimateType> {
		this.class.add('animated');
		this.class.add(animType);

		return new Promise<qAnimateType>(resolve => {
			this.eventOnce(['webkitAnimationEnd', 'mozAnimationEnd', 'MSAnimationEnd', 'oanimationend', 'animationend'], (e) => {
				if(this.class.contains(animType)) {
					resolve(animType);
					this.class.remove(animType);
				}
			});
		});
		
	}
}


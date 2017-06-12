import { Query as q } from '../query/query';
import {_Addon} from '../core/decorators/addon.decorator';
import {QueryItem} from '../query/queryItem';
import {QueryItemsList} from '../query/queryItemsList';

import { IAddon } from '../core/interfaces/addon.interface';
import '../styles/stick.addon.scss';


interface stickOptions {
	offset:number;
}

enum StickState {
	NONE,
	STICK,
	UNSTICK
}
export class Stick implements IAddon {
	public options:stickOptions = {
		offset: 0
	}
	private stickState:StickState;
	private qParent:QueryItem;
	private scrollFunc:(e:EventInit) => void;

	constructor(public owner:QueryItem, options?:stickOptions) {
		if(options)
			for(let option in options) {
				this.options[option] = options[option];
			}
	}

	onInit() {
		this.stickState = StickState.UNSTICK;
		//create parent wrapper
		let parentWrapper = document.createElement('div');

		this.qParent = new QueryItem(parentWrapper);
		this.qParent.moveBefore(this.owner);
		this.qParent.class.add('sticky-wrapper');

		console.log(this.qParent.unique, this.qParent.element);
		//insert owner into parent wrapper
		this.owner.moveInto(parentWrapper);
		this.qParent.style.height = this.owner.raw.clientHeight+'px';


		this.scroll(() => {
			this.stickCheck();
		})
	}

	scroll(func:() => void) {
		this.scrollFunc = func;
		document.addEventListener('scroll', this.scrollFunc);
	}

	onDestroy() {
		if(this.stickState == StickState.STICK)
			this.stickRemove();

		document.removeEventListener('scroll', this.scrollFunc);
		this.owner.moveUp();
		this.qParent.remove();
	}

	private stickCheck() {
		if(this.qParent.offset.top <= (window.pageYOffset + this.options.offset)
			&& this.stickState == StickState.UNSTICK) {
			this.stickAdd();
		} else if(this.stickState == StickState.STICK 
			&& this.qParent.offset.top > (window.pageYOffset + this.options.offset)) {
			this.stickRemove();
		}
	}
	private stickAdd() {
		this.owner.triggerEvent('stick', this.owner.raw);
		this.owner.class.add('sticked');

		
		this.owner.styles({
			'top': this.options.offset+'px'
		});

		this.stickState = StickState.STICK;
	}
	private stickRemove() {
		this.owner.triggerEvent('unstick', this.owner.raw);
		this.owner.class.remove('sticked');
		this.owner.style.top = '';
		this.stickState = StickState.UNSTICK;
	}


}

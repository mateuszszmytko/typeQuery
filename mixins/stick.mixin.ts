import { IMixin } from '../core/interfaces/mixin.interface';

import { Stick } from '../addons/stick.addon';
import {QueryItem} from '../query/queryItem';



interface stickOptions {
	offset:number;
}


export class qStick extends QueryItem implements IMixin {
    public stick(options?:stickOptions) {
		this.define(Stick, options);
	}
}
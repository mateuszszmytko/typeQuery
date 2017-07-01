import { IMixin } from '../core/interfaces/mixin.interface';
import {_Mixin} from '../core/decorators/mixin.decorator';

import { Slider, sliderOptions } from '../addons/slider.addon';
import {QueryItem} from '../query/queryItem';




export class qSlider extends QueryItem implements IMixin {
    public slider(options?:sliderOptions) {
		return this.addon(Slider)? this.addon(Slider): this.define( Slider, options);
	}

}

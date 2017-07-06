import { IMixin } from '../core/interfaces/mixin.interface';
import {_Mixin} from '../core/decorators/mixin.decorator';

import { Modal, modalOptions } from '../addons/modal.addon';
import {QueryItem} from '../query/queryItem';




export class qModal extends QueryItem implements IMixin {
    public modal(options?:modalOptions) {
		return this.addon(Modal)? <Modal>this.addon(Modal): this.define( Modal, options);
	}
}

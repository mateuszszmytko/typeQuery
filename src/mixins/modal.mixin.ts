import { IMixin } from '../core/interfaces/mixin.interface';
import {_Mixin} from '../core/decorators/mixin.decorator';

import { Modal, modalOptions } from '../addons/modal.addon';
import {QueryItem} from '../query/queryItem';




export class qModal extends QueryItem implements IMixin {
    public modal(options?:modalOptions) {
		if(this.addons.has('_modal'))
			return; 

		this.define('_modal', Modal, options);
	}

	public openModal() {
		if(!this.addons.has('_modal'))
			return; 

		(<Modal>this.addons.get('_modal')).openModal();
	}

	public closeModal() {
		if(!this.addons.has('_modal'))
			return; 

		(<Modal>this.addons.get('_modal')).closeModal();
	}

	public getModalState() {
		if(!this.addons.has('_modal'))
			return; 

		return (<Modal>this.addons.get('_modal')).modalState;
	}

	public destroyModal() {
		if(!this.addons.has('_modal'))
			return; 
			
		this.release('_modal');
	}
}

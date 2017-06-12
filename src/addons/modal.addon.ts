import { Query as q } from '../query/query';

import {QueryItem} from '../query/queryItem';
import {QueryItemsList} from '../query/queryItemsList';

import { IAddon } from '../core/interfaces/addon.interface';
import { qAnimateType, qAnimate } from '../mixins/animate.mixin';

import '../styles/modal.addon.scss';

export interface modalOptions {
	enterAnimation?:qAnimateType,
	closeAnimation?:qAnimateType,
	positionX?:'left'|'right'|'middle',
	positionY?:'top'|'bottom'|'middle',
	closeOnConfirm?:boolean,
	closeOnCancel?:boolean,
	closeOnOutsideClick?:boolean,
	hashTracking?:boolean,
	useOverlay?:boolean,
	overlayBackground?:string
}

enum ModalState {
	DuringOpening,
	DuringClosing,
	Open,
	Closed,
}
export class Modal implements IAddon {
	public options:modalOptions = {
		enterAnimation: 'fadeInDown',
		closeAnimation: 'fadeOutUp',
		positionX: 'middle',
		positionY: 'middle',
		closeOnConfirm: true,
		closeOnCancel: true,
		closeOnOutsideClick: true,
		hashTracking: true,
		useOverlay: true,
		overlayBackground: 'rgba(43,46,56,.9)'
	}

	private popstateListener:EventListener;

	private qLinks:QueryItemsList;
	private _modalState:ModalState;
	private qParent:QueryItem;
	private qOverlay:QueryItem;

	public get modalState() {
		return this._modalState;
	}


	constructor(public owner:QueryItem, options?:modalOptions) {
		if(options)
			for(const option in options) {
				this.options[option] = options[option];
			}
	}

	onInit() {

		this.qLinks = q('[rq-modal-target="'+this.owner.attr('rq-modal-id')+'"], [href="#'+this.owner.attr('rq-modal-id')+'"]');		
		this._modalState = ModalState.Closed;
		this.owner.class.add('rq-modal');

		//create modal wrapper
		const parentWrapper = document.createElement('div');

		this.qParent = new QueryItem(parentWrapper);
		this.qParent.moveBefore(this.owner);	
		this.owner.moveInto(parentWrapper);
		this.qParent.class.add('rq-modal__wrapper');

		//create overlay
		if(this.options.useOverlay) {
			const overlay = document.createElement('div');

			this.qOverlay = new QueryItem(overlay);
			this.qOverlay.moveBefore(this.qParent);	
			this.qOverlay.class.add('rq-modal__overlay');
			this.qOverlay.style.background = this.options.overlayBackground;
		}
		
		
		this.options.positionX != 'middle' ? this.qParent.class.add('rq-modal--x-'+this.options.positionX) : null;
		this.options.positionY != 'middle' ? this.owner.class.add('rq-modal--y-'+this.options.positionY) : null;
		
		this.initEvents();
		
		if(this.options.hashTracking && window.location.hash == '#'+this.owner.attr('rq-modal-id')) {
			this.openModal();
		}
	}

	public async openModal() {
		if(this._modalState != ModalState.Closed)
			return;

		this.owner.triggerEvent('qmodal-opening');
		this._modalState = ModalState.DuringOpening;
		
		this.qParent.class.add('opened');
		if(this.options.useOverlay)
			this.qOverlay.class.add('opened');

		document.querySelector('body').classList.add('rq-modal__body');
		await (<qAnimate>this.qParent).asyncAnimate(this.options.enterAnimation);

		this.owner.triggerEvent('qmodal-open');
		
		this._modalState = ModalState.Open;

		if(this.options.hashTracking)
			window.location.hash = this.owner.attr('rq-modal-id');
	}

	public async closeModal(reason?:string) {
		if(this._modalState != ModalState.Open)
			return;

		this.owner.triggerEvent('qmodal-closing', reason);
		this._modalState = ModalState.DuringClosing;
		
		if(this.options.useOverlay)
			this.qOverlay.class.remove('opened');

		await (<qAnimate>this.qParent).asyncAnimate(this.options.closeAnimation);

		document.querySelector('body').classList.remove('rq-modal__body');
		this.qParent.class.remove('opened');
		
		this.owner.triggerEvent('qmodal-closed', reason);
		if(reason == 'confirm') {
			this.owner.triggerEvent('qmodal-confirm', reason);
		} else if(reason == 'cancel') {
			this.owner.triggerEvent('qmodal-cancel', reason);
		}
		
		
		this._modalState = ModalState.Closed;
		if(this.options.hashTracking && window.location.hash == '#'+this.owner.attr('rq-modal-id')) 
			history.pushState("", document.title, window.location.pathname + window.location.search);
		
	}

	private initEvents() {
		this.qParent.event('click', (e) => {
			const target:HTMLElement = <HTMLElement>e.target;

			if(target.getAttribute('rq-modal-action') == 'confirm') {
				if(this.options.closeOnConfirm)
					this.closeModal('confirm');

				this.owner.triggerEvent('qmodal-confirm')
			} else if(target.getAttribute('rq-modal-action') == 'cancel') {
				if( this.options.closeOnCancel)
					this.closeModal('cancel');

				this.owner.triggerEvent('qmodal-cancel')
			} else if(target.getAttribute('rq-modal-action') == 'close') {
				this.closeModal('close');
			} else if(target.classList.contains('rq-modal__wrapper') && this.options.closeOnOutsideClick) {
				this.closeModal('outside');
			}

		});

		this.qLinks.each(qLink => {
			qLink.event('click', e => {
				e.preventDefault();
				
				this.openModal();
			})
		});
		
		if(this.options.hashTracking) {
			this.popstateListener = () => {
				if(window.location.hash == '#'+this.owner.attr('rq-modal-id') && this._modalState != ModalState.Open) {
					this.openModal();
				}

				if(window.location.hash != '#'+this.owner.attr('rq-modal-id') && this._modalState != ModalState.Closed) {
					this.closeModal();
				}
			}
			window.addEventListener('popstate', this.popstateListener);
		}
			
	}

	async onDestroy() {
		this.closeModal();

		this.owner.moveUp();
		this.qParent.remove();

		if(this.options.useOverlay)
			this.qOverlay.remove();

		if(this.options.hashTracking)
			window.removeEventListener('popstate', this.popstateListener);

		this.qLinks.each(qLink => qLink.clearAll());
		console.log('modal destroy');
	}

	

}

/*
beforeOpen
beforeClose

*/
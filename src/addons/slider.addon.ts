import { Query as q } from '../query/query';
import {_Addon} from '../core/decorators/addon.decorator';
import {QueryItem} from '../query/queryItem';
import {QueryItemsList} from '../query/queryItemsList';

import { delay } from '../utils/delay';

import { qAnimate, qAnimateType } from '../mixins/animate.mixin';

import { IAddon } from '../core/interfaces/addon.interface';
import '../styles/slider.addon.scss';

import { isQueryItem, isQueryItemsList, isHTMLElement, isNodeListOf } from '../core/typeguards';

export interface sliderOptions {
	slidesToShow?:number,
	slidesToScroll?:number;
	useArrows?:boolean;
	draggable?:boolean;
	prevArrow?:string;
	nextArrow?:string;
	infinity?:boolean;
	center?:boolean;
	autoplay?:number;
	autoplayOnHover?:boolean;
	autoplayOnFocus?:boolean;
	useDots?:boolean;
	fade?:boolean;
	fadeAnimation?:qAnimateType;
	slideOnClick?:boolean;
	responsive?:{[key:number]: sliderOptions};
	sync?:Array<QueryItem>;
	adaptiveHeight?:boolean;
	useDefaultTheme?:boolean;
}

enum SliderState  {
	Idle,
	Moving,
	Dragging
}


export class Slider implements IAddon {
	public options:sliderOptions = {
		slidesToShow: 1,
		slidesToScroll: 1,
		useArrows: true,
		draggable: true,
		prevArrow: '<button class="qSlider__arrow qSlider__arrow--prev">Previous</button>',
		nextArrow: '<button class="qSlider__arrow qSlider__arrow--next">Next</button>',
		infinity: true,
		center: false,
		autoplay: 0,
		autoplayOnHover: false,
		autoplayOnFocus: false,
		useDots: true,
		fade: false,
		fadeAnimation: 'fadeIn',
		slideOnClick: false,
		responsive: {
		},
		sync: [],
		adaptiveHeight: true,
		useDefaultTheme: true
	}

	private responsiveIndex:number = -1;
	private originalOptions:sliderOptions;

	private _currentPosition:number;
	public get currentPosition():number { return this._currentPosition; }

	private _currentSlide:number;
	private set currentSlide(slideIndex:number) {
		this._currentSlide = slideIndex;
		
		this.owner.data('current-slide', slideIndex.toString());
	}
	private get currentSlide():number {	return this._currentSlide;	}

	

	private sliderState:SliderState = SliderState.Idle;
	private async changeSliderState(state:SliderState, work?:()=>any) {
		this.sliderState = state;

		if(work) {
			await work();
			this.sliderState = SliderState.Idle;
		}
	}
	private get isIdle():boolean { return this.sliderState == SliderState.Idle}
	private isHover:boolean = false;
	private isFocus:boolean = false;

	private get isInfinite():boolean { return this.options.infinity && this.qCloneSlides != null}
	private get hasArrows():boolean { return this.options.useArrows && this.qArrowsContainer != null}

	//QueryItems
	private qSliderList:QueryItem;
	private qSliderTrack:QueryItem;
	private qSlides:QueryItemsList;
	private qCloneSlides:QueryItemsList;
	private qAllSlides:QueryItemsList;

	private qDotsContainer:QueryItem;
	private qDots:QueryItemsList;
	private qDotsButtons:QueryItemsList;

	private qArrowsContainer:QueryItem;
	private qPrevArrow:QueryItem;
	private qNextArrow:QueryItem;

	//autoplay
	private autoplayInterval:any;

	//
	private resizeEvent:() => any;


	//Helpers
	private get slideWidth():number 	 { return this.owner.raw.clientWidth/this.options.slidesToShow; }
	private get groupWidth():number 	 { return this.slideWidth*this.options.slidesToShow; }
	private get sliderTrackWidth():number{ return this.slideWidth*this.allSlidesCount; }
	private get slidesCount():number 	 { return this.qSlides.count; }
	private get allSlidesCount():number  { return this.qAllSlides.count; }

	private get leftEdge():number 		 { return this.options.center?(this.owner.raw.clientWidth/2-this.slideWidth/2)*-1: 0;}
	private get rightEdge():number 		 { return this.options.center? this.sliderTrackWidth-this.slideWidth: Math.max(0, this.sliderTrackWidth - (this.slideWidth*this.options.slidesToShow));}
	
	private get firstIndex():number 	 { return this.isInfinite? this.clonesCount*-1: 0; }
	private get lastIndex():number 		 { return this.isInfinite? this.slidesCount + this.clonesCount - 1: this.slidesCount-1; }

	private get lastReachableIndex():number { return this.options.center? this.lastIndex: Math.max(0, this.slidesCount-this.options.slidesToShow); }

	private get groupsCount():number 	 { return Math.ceil(this.slidesCount/this.options.slidesToScroll); }
	private get currentGroup():number 	 { return this.getGroupBySlide(this._currentSlide);	}

	private get nextGroup() {	return this.currentGroup + 1;	}
	private get prevGroup() {	return this.currentGroup - 1;	}

	private get clonesCount() { return this.options.slidesToShow + 1}

	private slidePosition(slideIndex:number):number {
		let pos = Math.min(this.slideWidth*(slideIndex-this.firstIndex), this.rightEdge);
		this.options.center? pos -= (this.owner.raw.clientWidth/2)-(this.slideWidth/2): null;
		return pos;
	}
	private groupPosition(groupIndex:number):number {
		return this.slidePosition(this.getSlideByGroup(groupIndex));
	}
	private getGroupBySlide(slideIndex:number) {
		return Math.floor(slideIndex/this.options.slidesToScroll);
	}

	private getSlideByGroup(groupIndex) {
		if(groupIndex < 0) {
			return this.getSlideByGroup(this.groupsCount + groupIndex) - this.slidesCount;
		}

		if(groupIndex >= this.groupsCount) {
			return this.slidesCount;
		}
		return groupIndex * this.options.slidesToScroll;
	}

	private isInGroup(groupIndex, slideIndex) {
		return this.getGroupBySlide(slideIndex) === groupIndex;
	}

	
	constructor(public owner:QueryItem, options?:sliderOptions) {
		//append user's options
		if(options)
			for(const o in options) 
				this.options[o] = options[o];

		this.originalOptions = {};
		for(const o in this.options) 
				this.originalOptions[o] = this.options[o];

		this.normalizeOptions();

		this.owner.triggerEvent('qSlider-init');
	}

	private normalizeOptions():void {
		this.options.slidesToScroll <= 0? this.options.slidesToScroll = 1: null;
		this.options.slidesToShow <= 0? this.options.slidesToShow = 1: null;

		this.options.center? this.options.slidesToScroll = 1: null;

		this.options.fade? this.options.slidesToShow = 1: null;
		this.options.fade? this.options.center = false: null;
		this.options.fade? this.options.slidesToScroll = 1: null;

	}

	onInit() {
		this.owner.class.add('qSlider');
		this.checkBreakpoints(false);

		this.build();		
	}

	onDestroy() {
		this.destroy();

		this.owner.triggerEvent('qSlider-destroy');
	}

	private build():void {
		this.coreBuild();
		this.buildClones();
		this.buildDots();
		this.buildArrows();

		this.attributes();
		this.sizing();

		this.coreEvents();
	}

	private destroy():void {
		this.destroyClones();
		this.destroyArrows();
		this.destroyDots();

		this.coreDestroy();

		window.removeEventListener('resize', this.resizeEvent);
		this.autoplayInterval? clearInterval(this.autoplayInterval): null;

		
	}

	private rebuild():void {
		//
		this.destroy();

		//building
		this.build();

		this.owner.triggerEvent('qSlider-reInit');
	}

	private coreBuild() {
		//create slider list
		this.qSliderList = q(this.owner.append('<div class="qSlider__list""></div>', 'beforebegin'));
		this.qSliderTrack = q(this.owner.append('<div class="qSlider__track" tabindex="-1"></div>', 'beforebegin'));
		this.qSliderTrack.moveInto(this.qSliderList);
		
		this.owner.children().each((qItem, i) => {
			qItem.moveInto(this.qSliderTrack);	
			const wrapper = qItem.append('<div class="qSlide" data-qslide-index="'+i+'"></div>', 'beforebegin');
			qItem.moveInto(wrapper);			
		});

		this.qSliderList.moveInto(this.owner);
		this.qSlides = this.qSliderTrack.children();

		if(this.options.fade) {
			this.owner.class.add('qSlider--fade');
		}

		if(this.options.adaptiveHeight) {
			this.owner.class.add('qSlider--adaptive');
		}

		if(this.options.useDefaultTheme) {
			this.owner.class.add('qSlider--theme');
		}

		if(this.options.draggable)
			this.dragEvents();

	}

	private buildClones():void {
		if(this.options.infinity && this.slidesCount > this.options.slidesToShow) {
			let clonesCount = this.options.slidesToShow + 1,
				qSlides = this.qSlides.queryItems;
			
			this.qCloneSlides = q();
			 
			for(let i = 0; i < clonesCount; i++) {
				let beforeClone = qSlides[i].clone(true);
				beforeClone.move(this.qSliderTrack, "beforeend");
				beforeClone.class.add('qSlide--clone');
				this.qCloneSlides.push(beforeClone);

				let afterClone = qSlides[(this.slidesCount - i - 1)].clone(true);
				afterClone.move(this.qSliderTrack, "afterbegin");
				afterClone.class.add('qSlide--clone');
				this.qCloneSlides.push(afterClone);
			}
		}

		this.qAllSlides = this.qSliderTrack.children();
	}

	private buildArrows():void {
		//arrows
		if(this.options.useArrows && this.slidesCount > this.options.slidesToShow) {
			this.qArrowsContainer = q(this.owner.append('<div class="qSlider__arrows"></div>'));

			this.qPrevArrow = q(this.qArrowsContainer.append(this.options.prevArrow));
			this.qNextArrow = q(this.qArrowsContainer.append(this.options.nextArrow));

			this.arrowsEvents();
		}

	}

	private buildDots():void {
		if(this.options.useDots && this.slidesCount > this.options.slidesToShow) {
			this.qDotsContainer = q(this.owner.append('<ul class="qSlider__dots"></ul>'));
			for(let i = 0; i < this.groupsCount; i++) {
				this.qDotsContainer.append('<li class="qSlider__dot" data-group-index="'+i+'"><button>'+i+'</button></li>')
			}
			this.qDots = this.qDotsContainer.children();
			this.qDotsButtons = q();
			this.qDots.each(q => {
				this.qDotsButtons.add(q.children().first);
			})
			this.dotsEvents();
		}
	}

	

	private coreDestroy():void {
		this.qSlides.each(q => {
			q.children().first.moveInto(this.owner);
			q.clear();
		});

		this.qSliderTrack.remove();
		this.qSliderList.remove();

		this.qSlides = null;
		this.qSliderList = null;
		this.qSliderTrack = null;

		this.owner.class.remove('qSlider', 'qSlider--theme', 'qSlider--draggable', 'qSlider--fade', 'qSlider--adaptive');


	}

	private destroyClones():void {
		this.qCloneSlides? this.qCloneSlides.each(q => q.remove()): null;

		this.qCloneSlides = null;
	}

	private destroyArrows():void {
		this.qPrevArrow? this.qPrevArrow.remove():null;
		this.qNextArrow? this.qNextArrow.remove():null;

		this.qArrowsContainer? this.qArrowsContainer.remove():null;

		this.qArrowsContainer = null;
		this.qPrevArrow = null;
		this.qNextArrow = null;

	}

	private destroyDots():void {
		this.qDots?this.qDots.each(q => {
			q.remove();
		}):null;

		this.qDotsContainer? this.qDotsContainer.remove(): null;

		this.qDots = null;
		this.qDotsContainer = null;
	}

	


	private sizing() {
		const slideWidth = this.slideWidth;

		this.qSliderTrack.style.width = `${this.sliderTrackWidth}px`;
		this.qAllSlides.each((q, index) => {
			q.style.width = `${slideWidth}px`;

			if(this.options.fade) {
				const leftOffset = index*this.slideWidth*-1;
				q.style.left = leftOffset+'px';
			} else {
				q.style.left = '';
			}
			
		});

		this.slideTo(this._currentSlide? this._currentSlide:0, true);	

	}

	private attributes() {
		let index = this.firstIndex;
		this.qAllSlides.each((qItem) => {
			qItem.data('qSlide-index', index.toString());
			index++;
		});
	}


	checkBreakpoints(rebuild:boolean = true) {
		const bodyWidth = document.body.clientWidth;
		let index = -1,
			responsiveOptions:sliderOptions;

		for(let r in this.options.responsive) {
			if(parseInt(r) >= bodyWidth) break;
			index++;
			responsiveOptions = this.options.responsive[r];
		}

		if(index !== this.responsiveIndex) {

			this.responsiveIndex = index;
			this.appendOptions(responsiveOptions, rebuild, false);

			this.owner.triggerEvent('qSlider-breakpoint', {options: responsiveOptions})
		}
	}

	

	

	private coreEvents():void {
		if(this.options.autoplay > 0) 
			this.autoplayInterval = setInterval(() => {
				if(this.options.autoplay === 0) return;
				if(!this.options.autoplayOnHover && this.isHover) return;
				if(!this.options.autoplayOnFocus && this.isFocus) return;

				if(this.isIdle)
					this.currentSlide == this.lastReachableIndex? this.slideTo(0): this.slideTo(this._currentSlide + this.options.slidesToScroll);
			}, this.options.autoplay);

		this.resizeEvent = () => {
			this.sizing(); 
			this.checkBreakpoints();
		}
		window.addEventListener('resize', this.resizeEvent);

		this.qSliderTrack.event('mouseenter', e => {
			this.isHover = true;
		});	
		this.qSliderTrack.event('mouseleave', e => {
			this.isHover = false;
		});	

		this.qSliderTrack.event('focus', e => {
			this.isFocus = true;
		});	

		this.qSliderTrack.event('blur', e => {
			this.isFocus = false;
		});	

		this.qAllSlides.each(q=> {
			q.event('click', e => {
				const slideIndex = parseInt(q.data('qslide-index'));
				if(this.isIdle) {
					this.owner.triggerEvent('qSlider-click', {slideIndex: slideIndex});
				}
				this.options.slideOnClick && this.isIdle && slideIndex !== this._currentSlide? this.slideTo(slideIndex):null;
				
			})
		})

	}

	private arrowsEvents():void {
		this.qPrevArrow.event('click', e => {
			this.isIdle? this.slideToGroup(this.prevGroup): null;
		});
		this.qNextArrow.event('click', e => {
			this.isIdle? this.slideToGroup(this.nextGroup): null;
		});
	}

	private dotsEvents():void {
		this.qDotsButtons.each(qItem => {
			qItem.event('click', e => {
				const groupIndex = parseInt(qItem.parent.data('group-index'));
				this.isIdle? this.slideTo(this.getSlideByGroup(groupIndex)): null;
			});
		});
	}

	private dragEvents():void {
		let isDragging:boolean = false,
			draggingPosition:number = 0,
			swipeLength:number = null,
			lastClientX:number = 0;

		this.owner.class.add('qSlider--draggable');

		//prevent chrome's bug
		document.body.addEventListener('touchstart', function(){});

		//prevent images/text dragging
		this.qSliderTrack.find(':not([draggable])').each(qItem => {
			qItem.event('dragstart', e => e.preventDefault());
		})
		

		this.qSliderTrack.event(['mousedown', 'touchstart'], e => {
			if(!this.isIdle) {
				return;
			}

			this.changeSliderState(SliderState.Dragging);

			let touches =(<any>e).touches,
				clientX = touches !== undefined ? touches[0].pageX : (<any>e).clientX;

			isDragging = true;
			draggingPosition = this.currentPosition;
			lastClientX = clientX;
			return false;

		});
		this.qSliderTrack.event(['mouseup', 'touchend', 'mouseleave', 'touchcancel'], e => {
			e.preventDefault();

			if(!isDragging)
				return;

			isDragging = false;
			this.changeSliderState(SliderState.Idle);
			draggingPosition !== this.currentPosition? this.slideToClosest(draggingPosition) : null;
			
			return false;
		});
		
		this.qSliderTrack.event(['mousemove', 'touchmove'], ev => {
			ev.preventDefault();
			if(!isDragging)
				return;

			let touches =(<any>ev).touches,
				clientX =  touches !== undefined ? touches[0].pageX : (<any>ev).clientX,
				swipeLength = lastClientX - clientX,
				swipeDirection = swipeLength < 0 ? "left":"right";
				
	
			if(swipeLength == 0)
				return;

			if(swipeDirection == "left" && draggingPosition < this.leftEdge ) 		swipeLength = swipeLength*.35;
			else if(swipeDirection == "right" && draggingPosition > this.rightEdge) swipeLength = swipeLength*.35; 

			draggingPosition = Math.round(swipeLength + draggingPosition) ;
			lastClientX = clientX;

			!this.options.fade? this.qSliderTrack.style.transform = `translateX(${draggingPosition*-1}px)`: null;
			
		});
	}

	


	


	private onSlideBefore(slideIndex:number, quiet:boolean = false, sync:boolean = true):void {
		const groupIndex = this.getGroupBySlide(slideIndex);


		if(this.options.adaptiveHeight) {
			let height = 0;

			this.qAllSlides.each(q => {
				let qSlideIndex = Number.parseInt(q.data('qslide-index')),
					isVisible = qSlideIndex >= slideIndex && qSlideIndex - slideIndex < this.options.slidesToShow;

				if(this.options.center) {
					isVisible = Math.abs(qSlideIndex - slideIndex) <= this.options.slidesToShow/2;
				}
				isVisible? height = Math.max(height, q.raw.clientHeight): null;
			});
			this.qSliderTrack.style.maxHeight = height + 'px';
		}

		if(!quiet) this.owner.triggerEvent('qSlider-beforeSlide', {currentSlide: this._currentSlide, newSlide: slideIndex})
	}

	private onSlideAfter(slideIndex:number) {

		//add classes
		this.qAllSlides.each(q => {
			let qSlideIndex = Number.parseInt(q.data('qslide-index')),
				isTarget = qSlideIndex === slideIndex,
				isVisible = qSlideIndex >= slideIndex && qSlideIndex - slideIndex < this.options.slidesToShow;

			isTarget? q.class.add('qSlide--active'): q.class.remove('qSlide--active');
			
			if(this.options.center) {
				isTarget? q.class.add('qSlide--center'): q.class.remove('qSlide--center');

				isVisible = Math.abs(qSlideIndex - slideIndex) <= this.options.slidesToShow/2;
			}
			isVisible? q.class.add('qSlide--visible'): q.class.remove('qSlide--visible');
		});

		//check arrows to disable
		if(!this.isInfinite && this.hasArrows) {
			slideIndex <= this.firstIndex? this.qPrevArrow.class.add('qSlider__arrow--disabled'): this.qPrevArrow.class.remove('qSlider__arrow--disabled');
			slideIndex >= this.lastReachableIndex? this.qNextArrow.class.add('qSlider__arrow--disabled'): this.qNextArrow.class.remove('qSlider__arrow--disabled');
		}

		//change dots
		if(this.qDots) {
			const currentGroup = this.currentGroup;
			this.qDots.each(q=> {
				const dotGroup = parseInt(q.data('group-index'));

				dotGroup == currentGroup 
					? q.class.add('qSlider__dot--active')
					: q.class.remove('qSlider__dot--active');
			});
		}

		if(this.options.fade) {
			this.qAllSlides.each(q => {
				let qSlideIndex = Number.parseInt(q.data('qslide-index')),
					isTarget = qSlideIndex === slideIndex;

				isTarget? q.style.zIndex = '101': q.style.zIndex = '100';
				isTarget? q.style.opacity = '1': q.style.opacity = '0';
			});
		}
		this.owner.triggerEvent('qSlider-afterSlide', {currentSlide: this._currentSlide})

	}

	

	private slideToClosest(position:number) {
		const currentPosition = this._currentPosition,
			  slideMoving = (position - currentPosition)/(this.slideWidth);

		let closestIndex = this.currentSlide;

		if(slideMoving > .33) {
			slideMoving - Math.floor(slideMoving) > .33? closestIndex += Math.ceil(slideMoving): closestIndex += Math.floor(slideMoving)
		} else if (slideMoving < -.33) {
			slideMoving - Math.ceil(slideMoving) < -.33? closestIndex += Math.floor(slideMoving): closestIndex += Math.ceil(slideMoving)
		}

		
		

		this.slideTo(closestIndex);
	}

	private slideToGroup(groupIndex:number):void {
		if(!this.options.infinity) {
			groupIndex = Math.max(0, groupIndex);
			groupIndex = Math.min(this.groupsCount - 1, groupIndex);
		}

		let slideIndex = this.getSlideByGroup(groupIndex);
	
		this.slideTo(slideIndex);
	}



	/////
	//
	//	Public methods
	//
	/////

	
	public async slideTo(slideIndex:number, quiet:boolean = false, sync:boolean = true) {
		const isTargetClone = slideIndex < 0 || slideIndex >= this.slidesCount,
			  isFade = this.options.fade;

		let targetSlide = slideIndex;

		if(isTargetClone && !this.isInfinite) {
			targetSlide < 0? targetSlide = 0: null;
			targetSlide > this.lastIndex? targetSlide = this.lastIndex: null;
		} else if(isTargetClone && isFade) {
			targetSlide < 0? targetSlide = this.slidesCount + targetSlide: null;
			targetSlide >= this.slidesCount? targetSlide = targetSlide - this.slidesCount: null;
		}

		if(this.options.sync && sync) {
			for (var i = 0; i < this.options.sync.length; i++) {
				var qItem = this.options.sync[i],
					addon = <Slider>qItem.addon(Slider),
					addonTargetSlide = slideIndex;

				if(!addon)
					continue;

				if(isTargetClone && !this.isInfinite) {
					addonTargetSlide < 0? addonTargetSlide = 0: null;
					addonTargetSlide > this.lastIndex? addonTargetSlide = this.lastIndex: null;
				}
				
				if(!addon.isInfinite && isTargetClone) {
					addonTargetSlide < 0? addonTargetSlide = addon.lastIndex: null;
					addonTargetSlide > addon.lastIndex? addonTargetSlide = 0: null;
				}
				addon._currentSlide !== addonTargetSlide? addon.slideTo(addonTargetSlide, false, false): null;
			}
		}

		this.onSlideBefore(targetSlide, quiet, sync);

		if(this.options.fade ) {
			const qCurrentSlide = this.qAllSlides.single(q => q.data('qslide-index') == targetSlide.toString()),
				  fadeAnimation =this.options.fadeAnimation;

			qCurrentSlide.styles({zIndex: '102', opacity: '0'});

			if(!quiet && this._currentSlide !==targetSlide) {
				await this.changeSliderState(SliderState.Moving, async () => {
					await (<qAnimate>qCurrentSlide).asyncAnimate(fadeAnimation, true)
				});
			}

			qCurrentSlide.styles({opacity: '1',	zIndex: '101'});
		} else {
			this.qSliderTrack.style.transform = `translateX(${this.slidePosition(targetSlide)*-1}px)`;

			!quiet? await this.changeSliderState(SliderState.Moving, async () => {
				this.qSliderTrack.style.transition = `transform 0.5s ease-in-out` + (this.options.adaptiveHeight? ', max-height .5s ease-in' : null);
				await delay(500);
				this.qSliderTrack.style.transition = "";
			}):null;


			
			if(this.isInfinite) {
				if(targetSlide < 0) {
					targetSlide = this.slidesCount+targetSlide;
					this.qSliderTrack.style.transform = `translateX(${this.slidePosition(targetSlide)*-1}px)`;
				} else if(targetSlide >= this.slidesCount) {
					targetSlide = targetSlide - this.slidesCount	;
					this.qSliderTrack.style.transform = `translateX(${this.slidePosition(targetSlide)*-1}px)`;
				}
			}
			
		}

		
		this._currentPosition = this.slidePosition(targetSlide);
		if(this.currentSlide == targetSlide)	return;

		this.currentSlide = targetSlide;

		this.onSlideAfter(targetSlide);
	}

	public appendOptions(options:sliderOptions, rebuild:boolean = true, replaceOriginal:boolean = true) {
		for(const o in this.originalOptions) this.options[o] = this.originalOptions[o];

		if(options) for(const o in options) this.options[o] = options[o];

		if(replaceOriginal) {
			for(const o in this.options) this.originalOptions[o] = this.options[o];
		}
		this.normalizeOptions();

		rebuild? this.rebuild(): null;
	}

	public addSlide(slideContent:string|HTMLElement|QueryItem, index?:number):void {
		let targetSlide = index !== undefined? this.qSlides.single(q => parseInt(q.data('qslide-index')) === index): null,
			newSlide = targetSlide? 
				targetSlide.append('<div class="qSlide"></div>', 'beforebegin'):
				this.qSliderList.append('<div class="qSlide"></div>', 'beforeend');


		q(newSlide).append(slideContent);
		this.qSlides = this.qSliderList.children(':not(.qSlide--clone)');

		this.rebuild();
	}

	public removeSlide(_index:number):void {
		let slideToRemove = this.qSlides.single(q=> parseInt(q.data('qslide-index')) == _index);
		this.qSlides.remove(slideToRemove).remove();
		this.rebuild();
	}


}

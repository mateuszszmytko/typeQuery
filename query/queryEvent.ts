enum EventState {
	BEFORE_INIT,
	ACTIVE,
	INACTIVE
}
export class QueryEvent {
	private _state:EventState = EventState.BEFORE_INIT;
	public get state():EventState {
		return this._state;
	}
	public get eventType():string|Array<string> {
		return this._eventType;
	}

	constructor(private el:HTMLElement, private _eventType:string|Array<string>, private eventListener?:(e:CustomEvent) => any) {
		if(this.eventListener)
			this.runEvent();
	}


	private runEvent():void {
		if(this.state == EventState.ACTIVE)
			return;

		if(typeof this.eventType === 'string') {
			this.el.addEventListener(this.eventType,this.eventListener);
		} else {
			for(let eName of this.eventType) {
				this.el.addEventListener(eName,this.eventListener);
			}
		}
		this._state = EventState.ACTIVE;
	}

	public changeEventType(eName:string|Array<string>) {
		this.pauseEvent();
		this._eventType = eName;
		this.runEvent();
	}
	public changeEventListener(_eventListener:EventListener) {
		this.pauseEvent();
		this.eventListener = _eventListener;
		this.runEvent();
	}

	public pauseEvent() {
		if(this.state == EventState.INACTIVE )
			return;
			
		if(typeof this.eventType === 'string') {
			this.el.removeEventListener(this.eventType, this.eventListener);
		} else {
			for(let eName of this.eventType) {
				this.el.removeEventListener(eName,this.eventListener);
			}
		}
		this._state = EventState.INACTIVE;
		return this;
	}

	public resumeEvent() {
		this.runEvent();
	}

}
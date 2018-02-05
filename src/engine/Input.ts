type listener = 'keydown' | 'keyup';

interface EventListener {
    listener: Function
}

class Input {
    private _keydownListeners           : Array<EventListener>;
    private _keyupListeners             : Array<EventListener>;

    constructor() {
        this._keydownListeners = [];
        this._keyupListeners = [];
    }

    init() {
        document.addEventListener("keydown", (ev: KeyboardEvent) => {
            this._callListeners(this._keydownListeners, ev);
        });

        document.addEventListener("keyup", (ev: KeyboardEvent) => {
            this._callListeners(this._keyupListeners, ev);
        });
    }

    private _callListeners(listeners: Array<EventListener>, ev: Event): void {
        for (let i=0,listener;listener=listeners[i];i++) {
            listener.listener(ev);
        }
    }

    public addListener(type: listener, callback: Function): EventListener {
        let ret: EventListener = {
            listener: callback
        }

        switch (type) {
            case 'keydown':
                this._keydownListeners.push(ret);
                break;

            case 'keyup':
                this._keyupListeners.push(ret);
                break;
        }

        return ret;
    }

    public removeListener(type: listener, listener: EventListener): void {
        let list: Array<EventListener>;

        switch (type) {
            case 'keydown':
                list = this._keydownListeners;
                break;

            case 'keyup':
                list = this._keyupListeners;
                break;
        }

        for (let i=0,length=list.length;i<length;i++) {
            if (list[i] === listener) {
                list.splice(i, 1);
                return;
            }
        }
    }
}

export default new Input();
class EventEmitter {
    constructor() {
        this._inputs = new Map();
    }

    /**
     * 
     * @param {string} event the name of the event.
     * @param {Function} func 
     */
    on(event, func) {
        if (this._inputs.has(event)) {
            this._inputs.get(event).push(func);
        } else {
            this._inputs.set(event, [func]);
        }
    }

    removeAll(eventName) {
        if (this._inputs.has(eventName)) {
            this._inputs.set(eventName, []);
        }
    }

    /**
     * 
     * @param {Event} event 
     */
    handleEvent(event) {
        if (this._inputs.has(event.type)) {
            this._inputs.get(event.type).forEach(f => f(event));
        }
    }
}

export {EventEmitter};
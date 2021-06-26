class EventEmitter {
    constructor() {
        /**
         * @private
         * @type {Map<string,Function[]>}
         */
        this._inputs = new Map();
    }

    /**
     * 
     * @param {string} eventName the name of the event.
     * @param {Function} func 
     */
    subscribe(eventName, func) {
        if (this._inputs.has(eventName)) {
            this._inputs.get(eventName).push(func);
        } else {
            this._inputs.set(eventName, [func]);
        }
    }

    removeAll(eventName) {
        if (this._inputs.has(eventName)) {
            this._inputs.delete(eventName);
        }
    }

    emit(eventName, ...args) {
        if (this._inputs.has(eventName)) {
            let funcs = this._inputs.get(eventName);
            funcs.forEach(fn => fn(...args));
        }
    }
}

export {EventEmitter};
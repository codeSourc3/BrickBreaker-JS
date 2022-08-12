import { template } from "./utils/utils.js";

/**
 * Internal function for validating event type
 * @param {string} eventName 
 * @returns {boolean}
 */
const isValidEvent = (eventName) => typeof eventName === 'string';
const ERR_MSG_EVENT_TYPE = 'string';

const isFunction = (type) => typeof type === 'function';

const typeErrorClosure = template`Expected a ${0} but got ${1}!`;

class PubSub {

    /* Not sure if it should be Set<Function> or Function[] */
    /**
     * @type {Map<string, Set<Function>}
     */
    #handlers = new Map();
    #makingPassOn = '';
    #cache = [];

    /**
     * 
     * @param {string} eventName the name of the event to subscribe to.
     * @param {Function} func the function to register
     */
    subscribe(eventName, func) {
        if (!isFunction(func)) {
            throw new TypeError(typeErrorClosure('function', String(func)));
        }
        if (!isValidEvent(eventName)) {
            throw new TypeError(typeErrorClosure(ERR_MSG_EVENT_TYPE, eventName));
        }
        if (this.#handlers.has(eventName)) {
            if (this.#makingPassOn === eventName) {
                this.#cache.push(func);
            } else {
                const eventHandlers = this.#handlers.get(eventName);
                eventHandlers.add(func);
            }
            
        } else {
            this.#handlers.set(eventName, new Set([func]));
        }
    }

    /**
     * 
     * @param {string} eventName the name of the event the function participates in.
     * @param {*} func the original function to remove.
     */
    unsubscribe(eventName, func) {
        if (!isFunction(func)) {
            throw new TypeError(typeErrorClosure('function', String(func)));
        }
        if (!isValidEvent(eventName)) {
            throw new TypeError(typeErrorClosure(ERR_MSG_EVENT_TYPE, eventName));
        }
        if (this.#handlers.has(eventName)) {
            const eventHandlers = this.#handlers.get(eventName);
            eventHandlers.delete(func);
        }
    }

    /**
     * 
     * @param {string} eventName 
     */
    unsubscribeAll(eventName) {
        if (!isValidEvent(eventName)) {
            throw new TypeError(typeErrorClosure(ERR_MSG_EVENT_TYPE, eventName));
        }
        if (this.#handlers.has(eventName)) {
            this.#handlers.delete(eventName);
        }
    }

    emit(eventName, ...args) {
        if (!isValidEvent(eventName)) {
            throw new TypeError(typeErrorClosure(ERR_MSG_EVENT_TYPE, eventName));
        }
        this.#makingPassOn = eventName;
        if (this.#handlers.has(eventName)) {
            let funcs = this.#handlers.get(eventName);
            funcs.forEach(fn => fn(...args));
        }
        this.#makingPassOn = '';
        let funcs = this.#handlers.get(eventName)
        const len = this.#cache.length;
        for (let i = 0; i < len; i++) {
            funcs.add(this.#cache[i]);
        }
        this.#cache.length = 0;
    }

    *eventNames() {
        yield *this.#handlers.keys();
    }

    handlerCountOf(eventName) {
        if (!isValidEvent(eventName)) {
            throw new TypeError(typeErrorClosure(ERR_MSG_EVENT_TYPE, eventName));
        }
        return this.#handlers.get(eventName).size();
    }
}

export {PubSub};
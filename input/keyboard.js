import { PubSub } from "../eventemitter.js";

const Keys = Object.freeze({
    ALT: 'Alt',
    ALTGRAPH: 'AltGraph',
    CAPSLOCK: 'CapsLock',
    CONTROL: 'Control',
    FN: 'Fn',
    FNLOCK: 'FnLock',
    META: 'Meta',
    SHIFT: 'Shift',
    ENTER: 'Enter',
    TAB: 'Tab',
    SPACE: ' ',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_UP: 'ArrowUp',
    ESCAPE: 'Escape'
});


class KeyboardManager {
    /**
     * @type {Set<string>}
     */
    #pressedKeys = new Set();
    #bindings = new Map();
    events = new PubSub();

    static KEY_UP = 'key-up';
    static KEY_DOWN = 'key-down';

    #lastRelevantInput = 0;

    static Keys = Keys;

    constructor() {
        window.addEventListener('keydown', this);
        window.addEventListener('keyup', this);
    }

    /**
     * 
     * @param {string} action 
     * @param  {...string} keys 
     */
    bindKeys(action, ...keys) {
        for (const key of keys) {
            this.#bindings.set(key, action);
        }
    }

    /**
     * 
     * @param  {...string} keys 
     */
    unbindKeys(...keys) {
        for (const key of keys) {
            this.#bindings.delete(key);
        }
    }


    /**
     * Returns if the provided key was pressed as of the last event.
     * 
     * @param  {string} key the key corresponding to KeyboardEvent#key.
     */
    isPressed(key) {
        return this.#pressedKeys.has(key);
    }

    isCtrlPressed() {
        return this.#pressedKeys.has(KeyboardManager.Keys.CONTROL);
    }

    isAltPressed() {
        return this.#pressedKeys.has(KeyboardManager.Keys.ALT);
    }

    isShiftPressed() {
        return this.#pressedKeys.has(KeyboardManager.Keys.SHIFT);
    }

    get lastRelevantInput() {
        return this.#lastRelevantInput;
    }

    unbindAll() {
        this.#bindings.clear();
    }

    /**
     * 
     * @param {KeyboardEvent} keyboardEvt 
     */
    handleEvent(keyboardEvt) {
        if (keyboardEvt.type === 'keydown') {
            keyboardEvt.preventDefault();
            this.#pressedKeys.add(keyboardEvt.key);
            this.#lastRelevantInput = keyboardEvt.timeStamp;
            if (this.#bindings.has(keyboardEvt.key)) {
                this.events.emit(KeyboardManager.KEY_DOWN, keyboardEvt.key, this.#bindings.get(keyboardEvt.key), keyboardEvt.repeat);
            } else {
                this.events.emit(KeyboardManager.KEY_DOWN, keyboardEvt.key);
            }
            return;
        } else if (keyboardEvt.type === 'keyup') {
            keyboardEvt.preventDefault();
            this.#pressedKeys.delete(keyboardEvt.key);
            this.#lastRelevantInput = keyboardEvt.timeStamp;
            if (this.#bindings.has(keyboardEvt.key)) {
                this.events.emit(KeyboardManager.KEY_UP, keyboardEvt.key, this.#bindings.get(keyboardEvt.key), keyboardEvt.repeat);
            } else {

                this.events.emit(KeyboardManager.KEY_UP, keyboardEvt.key);
            }
            return;
        }
    }
}
const keyboard = new KeyboardManager();
export default keyboard;

export {Keys, KeyboardManager};
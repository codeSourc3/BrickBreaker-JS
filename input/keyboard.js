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
     * @type {Map<string, KeyboardEvent>}
     */
    #pressedKeys = new Map();
    
    events = new PubSub();

    static Keys = Keys;

    constructor() {
        window.addEventListener('keydown', this);
        window.addEventListener('keyup', this);
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

    /**
     * 
     * @param {KeyboardEvent} keyboardEvt 
     */
    handleEvent(keyboardEvt) {
        if (keyboardEvt.type === 'keydown') {
            this.#pressedKeys.set(keyboardEvt.key, keyboardEvt);
            return;
        } else if (keyboardEvt.type === 'keyup') {
            this.#pressedKeys.delete(keyboardEvt.key);
            return;
        }
    }
}
const keyboard = new KeyboardManager();
export default keyboard;

export {Keys};
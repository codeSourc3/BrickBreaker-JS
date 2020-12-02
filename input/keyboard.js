
const Key = {
    _pressed: {},

    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    P: 'p',
    Q: 'q',
    A: 'a',
    D: 'd',

    init() {
        this._pressed = {};
    },
    /**
     * 
     * @param {string} key 
     */
    isDown(key) {
        return this._pressed[key];
    },

    /**
     * 
     * @param {KeyboardEvent} event 
     */
    onKeydown(event) {
        console.assert(this._pressed !== undefined);
        this._pressed[event.key] = event.key;
        this._pressed[event.key] = true;
    },

    /**
     * 
     * @param {KeyboardEvent} event 
     */
    onKeyup(event) {
        console.assert(this._pressed !== undefined);
        delete this._pressed[event.key];
    }

};

export {Key};

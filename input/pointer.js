export class Pointer {
    #currentCoords={x: 0, y: 0};
    pointerType;
    pointerWidth;
    pointerHeight;
    lastUpdated;
    pointerId;
    isPrimary;
    #target;
    #currentBounds;
    #controller = new AbortController();
    #wasClicked = false;
    #isInBounds = false;
    #isRegistered = false;

    static instance;

    /**
     * 
     * @param {HTMLCanvasElement} canvasElement 
     */
    constructor(canvasElement) {
        this.#target = canvasElement;
        this.#currentBounds = this.#target.getBoundingClientRect();
    }

    /**
     * 
     * @param {HTMLCanvasElement} canvasElement 
     * @returns {Pointer}
     */
    static getInstance(canvasElement) {
        if (Pointer.instance) {
            return Pointer.instance;
        }
        Pointer.instance = new Pointer(canvasElement);
        return Pointer.instance;
    }

    attach() {
        this.#target.addEventListener('pointermove', this, {signal: this.#controller.signal});
        this.#target.addEventListener('pointerdown', this, {signal: this.#controller.signal});
        this.#target.addEventListener('pointerup', this, {signal: this.#controller.signal});
        this.#target.addEventListener('click', this, {signal: this.#controller.signal});
        this.#target.addEventListener('pointerenter', this, {signal: this.#controller.signal});
        this.#target.addEventListener('pointerleave', this, {signal: this.#controller.signal});
        this.#isRegistered = true;
    }

    detach() {
        this.#controller.abort();
        this.#isRegistered = false;
    }

    get attached() {
        return this.#isRegistered;
    }


    get isInBounds() {
        return this.#isInBounds;
    }

    get x() {
        return this.#currentCoords.x;
    }

    get y() {
        return this.#currentCoords.y;
    }

    get wasClicked() {
        return this.#wasClicked;
    }

    reset() {
        this.#wasClicked = false;
    }

    /**
     * 
     * @param {PointerEvent} evt 
     */
    handleEvent(evt) {
        this.#currentBounds = this.#target.getBoundingClientRect();
        this.#currentCoords.x = evt.clientX - this.#currentBounds.left;
        this.#currentCoords.y = evt.clientY - this.#currentBounds.top;
        this.isPrimary = evt.isPrimary;
        this.lastUpdated = evt.timeStamp;
        this.pointerHeight = evt.height;
        this.pointerWidth = evt.width;
        this.pointerId = evt.pointerId;
        this.pointerType = evt.pointerType;
        this.#wasClicked = evt.type === 'click';
        if (evt.type === 'pointerenter') {
            this.#isInBounds = true;
        }
        if (evt.type === 'pointerover') {
            this.#isInBounds = true;
        } 
        if (evt.type === 'pointerleave') {
            this.#isInBounds = false;
        }
    }
}
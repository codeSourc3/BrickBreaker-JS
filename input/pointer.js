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
    }

    detach() {
        this.#controller.abort();
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
    }
}
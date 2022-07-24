

export class Clock {
    /**
     * @type {number}
     */
    #now;
    /**
     * @type {number}
     */
    #sinceStart;
    /**
     * @type {string}
     */
    #currentFPS;
    #elapsed;
    #previousTimestamp;
    #frameId;
    #isRunning = false;
    #fpsInterval;
    #startTime;
    #frameCount = 0;
    static #MS_PER_UPDATE = 12;

    /**
     * 
     * @param {number} desiredFPS 
     * @param {(elapsed: number) => void} updateCallback 
     * @param {() => void} renderCallback
     */
    constructor(desiredFPS, updateCallback, renderCallback) {
        this.#fpsInterval = 1000 / desiredFPS;
        this.updateCallback = updateCallback;
        this.renderCallback = renderCallback;
        this.step = this.step.bind(this);
    }

    start() {
        this.#isRunning = true;
        this.#previousTimestamp = performance.now();
        this.#startTime = this.#previousTimestamp;
        this.#frameId = window.requestAnimationFrame(this.step);
    }

    /**
     * 
     * @param {number} timestamp 
     */
    step(timestamp) {
        this.#now = timestamp;
        this.#elapsed = this.#now - this.#previousTimestamp;
        this.#sinceStart = this.#now - this.#startTime;
        this.#currentFPS = (Math.round(1000 / (this.#sinceStart / ++this.#frameCount) * 100) / 100).toFixed(2);
        if (this.#elapsed > this.#fpsInterval) {
            this.updateCallback(this.#elapsed);
            this.renderCallback();
            this.#previousTimestamp = this.#now - (this.#elapsed % this.#fpsInterval);
        }
        this.#frameId = requestAnimationFrame(this.step);
    }

    stop() {
        window.cancelAnimationFrame(this.#frameId);
        this.#isRunning = false;
    }

    get currentFPS() {
        return this.#currentFPS;
    }

    get running() {
        return this.#isRunning;
    }
}
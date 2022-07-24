

export class Clock {
    #start;
    #elapsed;
    #previousTimestamp;
    #frameId;
    #isRunning = false;
    #fpsInMillis;
    #lag=0;
    static #MS_PER_UPDATE = 12;

    /**
     * 
     * @param {number} desiredFPS 
     * @param {(elapsed: number) => void} updateCallback 
     * @param {() => void} renderCallback
     */
    constructor(desiredFPS, updateCallback, renderCallback) {
        this.#fpsInMillis = desiredFPS / 1000;
        this.updateCallback = updateCallback;
        this.renderCallback = renderCallback;
        this.step = this.step.bind(this);
    }

    start() {
        this.#frameId = window.requestAnimationFrame(this.step);
        this.#isRunning = true; 
    }

    step(timestamp) {
        if (typeof this.#previousTimestamp === 'undefined') {
            this.#previousTimestamp = timestamp;
        }
        this.#elapsed = timestamp - this.#previousTimestamp;
        this.#previousTimestamp = timestamp;

        this.updateCallback(this.#elapsed);
        this.renderCallback();
        this.#frameId = window.requestAnimationFrame(this.step);
    }

    stop() {
        window.cancelAnimationFrame(this.#frameId);
        this.#isRunning = false;
    }

    get running() {
        return this.#isRunning;
    }
}
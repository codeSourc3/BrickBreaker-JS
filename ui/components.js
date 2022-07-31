import {GameObject} from '../entities/GameObject.js'

/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */

class UIObject extends GameObject {
	
	/**
	 * @param {number} x the x coordinate relative to the upper left corner.
	 * @param {number} y the y coordinate relative to the upper left corner.
	 * @param {number} width the width of the ui object.
	 * @param {number} height the height of the ui object.
	 */
    constructor(x, y, width, height) {
        super();
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
    }
    
    /**
     * Gets if the pointer is intersecting with this objects dimensions..
     * @param {PointerEvent} pointer the pointer event.
     * @return {boolean} true if pointer is within ui object, false otherwise.
     */
    intersects(pointer) {
        return pointer.offsetX > this._x && 
        pointer.offsetX < this._x + this._width 
        && pointer.offsetY > this._y 
        && pointer.offsetY < this._y + this._height;
    }

    /**
     * 
     * @param {{x: number, y: number}} param0 
     * @returns 
     */
    intersectsXY({x, y}) {
        return x > this._x && x < this._x + this._width && y > this._y && y < this._y + this._height;
    }

    
    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get width() {
        return this._width;
    }


    get height() {
        return this._height;
    }

    draw(ctx) {
        //
    }

    update(elapsed) {
        //
    }
}

export class Button extends UIObject {
	
		/**
		 * 
		 * @param {string} text the text on the button
		 * @param {number} x coordinate on the x-axis.
         * - Starts at the left side of the canvas.
		 * @param {number} y coordinate on the y-axis.
         * - Starts at the top of the canvas.
		 * @param {number} width the width of the button.
		 * @param {number} height the height of the button.
         * @param {string} buttonColor the color of the button background.
         * @param {string} textColor the color of the text.
		 */
    constructor(text, x, y, width, height, {buttonColor='blue', textColor='white', hoverTextColor=textColor, hoverBackgroundColor='lightblue'}={}) {
        super(x, y, width, height);
        this._clicked = false;
        this.text = text;
        this.buttonColor = buttonColor;
        this.textColor = textColor;
        this.currentButtonColor = this.buttonColor;
        this.currentTextColor = this.textColor;
        this.hovering = false;
        this.hoverBackgroundColor = hoverBackgroundColor;
        this.hoverTextColor = hoverTextColor;
        /**
         * 
         * @param {number} elapsed the amount of milliseconds since last
         * render.
         */
        this.onHover = (elapsed) => {};
    }

		/**
		 * Sets the handler of the Button.
		 * @param {function} fn the handler function.
		 */
    setHandler(fn) {
        this.handler = fn;
    }
    
    /**
     * When pointer is down on the button's position.
     * @param {PointerEvent} pointer 
     */
    clickedOn(pointer) {
        if (this.intersects(pointer)) {
            this.handler();
            this._clicked = true;
            return true;
        }
        return false;
    }

    get clicked() {
        return this._clicked;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        // Save state before drawing.
        ctx.save();
        // draw button
        ctx.textBaseline = 'top';
        ctx.fillStyle = this.currentButtonColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        // text options

        const fontSize = 20;
        ctx.fillStyle = this.currentTextColor;
        ctx.font = fontSize + 'px sans-serif';

        // text position: centering
        const textSize = ctx.measureText(this.text);
        const textX = this.x + (this.width / 2) - (textSize.width / 2);
        const texty = this.y + (this.height / 2) - (fontSize / 2);
        ctx.fillText(this.text, textX, texty);

        // Restore state to state before drawing took place.
        ctx.restore();
    }

    reset() {
        this.currentButtonColor = this.buttonColor;
        this.currentTextColor = this.textColor;
    }

    update(elapsed) {
        if (this.hovering) {
            this.onHover(elapsed);
        }
    }
}

/**
 * Draws the text and centers it.
 * @param {CanvasRenderingContext2D} ctx the current drawing context
 * @param {number} y the y coordinate to display at.
 * @param {string} text the text to use.
 */
export function centerText(ctx, y, text) {
    let measurement = ctx.measureText(text);
    let x = (ctx.canvas.width - measurement.width) / 2;
    ctx.fillText(text, x, y);
}
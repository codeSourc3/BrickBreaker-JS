/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import { Globals } from "../game.js";
import { Pointer } from "../input/pointer.js";
import { Vec2 } from "../math/vec2.js";
import { GameObject } from './GameObject.js';

const PADDLE_MOVEMENT_SPEED = 7;

/**
 * Handles paddle width, height and responds to events
 */
class Paddle extends GameObject {
    /**
     * Paddle is fixed at its Y-axis
     * @param {number} paddleX the position of the top-left corner on the x-axis.
     * @param {number} paddleHeight the height of the paddle.
     * @param {number} paddleWidth the width of the paddle.
     */
    constructor(paddleX, paddleHeight, paddleWidth) {
        super();
        this._paddleX = paddleX;
        this._paddleHeight = paddleHeight;
        this._paddleWidth = paddleWidth;
        this._rightPressed = false;
        this._leftPressed = false;
        this._delta = new Vec2(0, 0);
        this._paddleY = 0;
        this._isUsingPointer = false;
        this._lastRelevantInput = 0;
    }

    update(elapsed) {
        const { width, height } = Globals.getGameDimensions();

        if (this.right + this._delta.x > width) {
            this.x = width - this.width;
            // hit the right side of the display.
            this._delta.x = 0;
        }
        if (this.left + this._delta.x < 0) {
            this.x = 0;
            this._delta.x =  0;
        }

        this._paddleX += this._delta.x;
        const pointer = Pointer.getInstance();

        if ((this._lastRelevantInput === 'undefined' || this._lastRelevantInput < pointer.lastUpdated ) && pointer.isInBounds) {
            this._isUsingPointer = true;
            this._lastRelevantInput = pointer.lastUpdated;
            let relativeX = pointer.x;
            if (relativeX - this.halfWidth > 0 && relativeX + this.halfWidth < Globals.getCanvasElement().width) {
                let newPosition = relativeX - this.halfWidth;
                this.x = newPosition;
            }
        } else {
            this._isUsingPointer = false;
        }
        
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.save();
        context.beginPath();
        this._paddleY = context.canvas.height - this._paddleHeight;
        context.rect(
            this._paddleX,
            this._paddleY,
            this._paddleWidth,
            this._paddleHeight);
        context.fillStyle = '#0095DD';
        context.fill();
        context.closePath();
        context.restore();

        context.beginPath();
        context.moveTo(this.centerX, this.centerY);
        context.lineTo(this.centerX + this._delta.x * 5, this.centerY + this._delta.y * 5);
        context.strokeStyle = 'black';
        context.stroke();
        context.closePath();
    }

    get paddleX() {
        return this._paddleX;
    }

    get x() {
        return this.paddleX;
    }

    get y() {
        return this._paddleY;
    }

    get width() {
        return this._paddleWidth;
    }

    get height() {
        return this._paddleHeight;
    }

    get halfWidth() {
        return this._paddleWidth / 2;
    }

    get halfHeight() {
        return this._paddleHeight / 2;
    }

    /**
     * @return {Vec2} representing the center point of the rectangle.
     */
    get center() {
        return new Vec2(this.centerX, this.centerY);
    }
    get centerX() {
        return this.x + this.halfWidth;
    }

    get centerY() {
        return this.y + this.halfHeight;
    }

    get top() {
        return this.y;
    }

    get bottom() {
        return this.y + this.height;
    }

    get right() {
        return this.x + this.width;
    }

    set x(value) {
        this.paddleX = value;
    }


    get left() {
        return this.x;
    }


    get paddleWidth() {
        return this._paddleWidth;
    }

    get paddleHeight() {
        return this._paddleHeight;
    }

    set paddleX(num) {
        this._paddleX = num;
    }

    set paddleWidth(newWidth) {
        this._paddleWidth = newWidth;
    }

    set paddleHeight(newHeight) {
        this._paddleHeight = newHeight;
    }

    moveLeft() {
        this._paddleX -= 7;
        if (this._paddleX < 0) {
            this._paddleX = 0;
        }
    }

    moveRight() {
        this._paddleX += 7;
        if (this._paddleX + this._paddleWidth > Globals.getGameDimensions().width) {
            this._paddleX = Globals.getGameDimensions().width - this._paddleWidth;
        }
    }

    /**
     * 
     * @param {KeyboardEvent} evt 
     */
    _onKeyDown(evt) {
        if (evt.key === 'ArrowLeft' || evt.key === 'Left' || evt.key === 'a') {
            this._leftPressed = true;
            this._delta.x = -PADDLE_MOVEMENT_SPEED;
            this._lastRelevantInput = evt.timeStamp;
            console.debug('A button pressed', this._lastRelevantInput);
            evt.preventDefault();
        } else if (evt.key === 'ArrowRight' || evt.key === 'Right' || evt.key === 'd') {
            this._rightPressed = true;
            this._delta.x = PADDLE_MOVEMENT_SPEED;
            this._lastRelevantInput = evt.timeStamp;
            evt.preventDefault();
        }
    }

    _onKeyUp(evt) {
        if (evt.key === 'ArrowLeft' || evt.key === 'Left' || evt.key === 'a') {
            this._leftPressed = false;
            this._delta.x = 0;
            this._lastRelevantInput = evt.timeStamp;
            evt.preventDefault();
        } else if (evt.key === 'ArrowRight' || evt.key === 'Right' || evt.key === 'd') {
            this._rightPressed = false;
            this._lastRelevantInput = evt.timeStamp;
            this._delta.x = 0;
            evt.preventDefault();
        }
    }

    /**
     * 
     * @param {Event} evt the code handles keydown, keyup, and pointermove
     */
    handleEvent(evt) {
        switch (evt.type) {
            case 'keydown':
                this._onKeyDown(evt);
                break;
            case 'keyup':
                this._onKeyUp(evt);
                break;

        }


    }


}

export { Paddle };
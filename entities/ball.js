import { Globals } from '../game.js';
import {Vec2} from '../math/vec2.js';
import {GameObject} from './GameObject.js';

/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */

/**
 * Handles ball position, width and bouncing logic.
 */
class Ball extends GameObject {
    /**
     * 
     * @param {number} x the position of the topmost point of the ball on the x-axis. 
     * @param {number} y the position of the topmost point of the ball on the y-axis.
     * @param {number} ballRadius the radius of the ball from the center of the ball.
     */
	constructor(x, y, ballRadius) {
        super();
        /**
         * @private
         */
        this._pos = new Vec2(x, y);
        /**
         * @private
         */
        this._delta = new Vec2(3, -3);
        this._speed = 3;
        /**
         * @private
         */
        this._ballRadius = ballRadius;
    }

    /**
     * Draws the ball and then does update logic after.
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        // could convert to Path2D object for modularity.
        context.save();
        context.beginPath();
        context.arc(this._pos.x, this._pos.y, this._ballRadius, 0, Math.PI * 2);
        context.fillStyle = '#0095DD';
        context.fill();
        context.closePath();
        context.restore();

        
    }

    /**
     * Adds an amount to the velocity of the ball.
     * @param {number} increment the positive integer to add to the current velocity.
     */
    increaseSpeed(increment) {
        let amnt = Math.floor(Math.abs(increment));
        
        if (this._delta.x > 0) {
            // goint rightwards.
            this._delta.x += amnt;
        } else if (this._delta.x < 0) {
            // going leftwards.
            this._delta.x -= amnt;
        }
        if (this._delta.y > 0) {
            // going downwards.
            this._delta.y += amnt;
        } else if (this._delta.y < 0) {
            // going upwards.
            this._delta.y -= amnt;
        }
        
    }

    /**
     * Decreases the speed by an amount. Speed can't be lower than 0.
     * @param {number} increment the positive integer to subtract from the current velocity.
     */
    decreaseSpeed(increment) {
        let amnt = Math.floor(Math.abs(increment));

        if (this._delta.x > 0) {
            this._delta.x -= amnt;
        } else if (this._delta.x < 0) {
            this._delta.x += amnt;
        }

        if (this._delta.y > 0) {
            this._delta.y -= amnt;
        } else if (this._delta.y < 0) {
            this._delta.y += amnt;
        }
    }

    
    update(elapsed) {
        const {width} = Globals.getGameDimensions();
        if (this._pos.x + this._delta.x > width - this._ballRadius || this._pos.x + this._delta.x < this._ballRadius) {
            this._delta.x = -this._delta.x;
        }
        // check bottom and check top
        if (this._pos.y + this._delta.y < this._ballRadius) {
            Vec2.invertY(this._delta);
        }

        this._pos.x += this._delta.x;
        this._pos.y += this._delta.y;
    }

    get speed() {
        return this._speed;
    }

    set speed(value) {
        this._speed = Number(value);
    }

    /**
     * @return {number} the heading in degrees.
     */
    get heading() {
        let radians = Math.atan2(this.vy, this.vx);
        return 180 * radians / Math.PI;
    }

    get x() {
        return this._pos.x;
    }

    set x(num) {
        this._pos.x = num;
    }

    get y() {
        return this._pos.y;
    }

    set y(num) {
        this._pos.y = num;
    }

    get dy() {
        return this._delta.y;
    }

    set dy(num) {
        this._delta.y = num;
    }

    get dx() {
        return this._delta.x;
    }

    set dx(num) {
        this._delta.x = num;
    }

    /**
     * Gets the center of the ball
     * @return {Vec2} a {@link Vec2} representing the center of the ball.
     */
    get center() {
        return new Vec2(this.x, this.y);
    }

    get delta() {
        return this._delta;
    }

    /**
     * Flips the sign of the delta X (the change in distance on the X-axis).
     */
    flipDx() {
        this._delta.x = -this._delta.x;
    }

    /**
     * Flips the sign of the delta Y (the change in distance on the Y-axis).
     */
    flipDy() {
        this._delta.y = -this._delta.y;
    }

    stop() {
        this._delta.x = 0;
        this._delta.y = 0;
    }

    reset() {
        let canvas = Globals.getCanvasElement();
        this._pos.x = canvas.width / 2;
        this._pos.y = canvas.height - 30;
        this._delta.x = 2;
        this._delta.y = -2;
    }

    get radius() {
        return this._ballRadius;
    }
}

export {Ball};
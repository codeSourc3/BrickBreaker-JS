/**
 * Handles ball position, width and bouncing logic.
 */
class Ball {
	constructor(x, y, ballRadius) {
        this._x = x;
        this._y = y;
        this._dx = 2;
        this._dy = -2;
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
        context.arc(this._x, this._y, this._ballRadius, 0, Math.PI * 2);
        context.fillStyle = '#0095DD';
        context.fill();
        context.closePath();
        context.restore();

        if (this._x + this._dx > context.canvas.width - this._ballRadius || this._x + this._dx < this._ballRadius) {
            this._dx = -this._dx;
        }
        // check bottom and check top
        // TODO: Allow ball to bounce off side of paddle.
        if (this._y + this._dy < this._ballRadius) {
            this._dy = -this._dy;
        }
    }

    /**
     * Adds an amount to the velocity of the ball.
     * @param {number} increment the positive integer to add to the current velocity.
     */
    increaseSpeed(increment) {
        let amnt = Math.floor(Math.abs(increment));
        
        if (this.dx > 0) {
            // goint rightwards.
            this.dx += amnt;
        } else if (this.dx < 0) {
            // going leftwards.
            this.dx -= amnt;
        }
        if (this.dy > 0) {
            // going downwards.
            this.dy += amnt;
        } else if (this.dy < 0) {
            // going upwards.
            this.dy -= amnt;
        }
        
    }

    /**
     * Decreases the speed by an amount. Speed can't be lower than 0.
     * @param {number} increment the positive integer to subtract from the current velocity.
     */
    decreaseSpeed(increment) {
        let amnt = Math.floor(Math.abs(increment));

        if (this.dx > 0) {
            this.dx -= amnt;
        } else if (this.dx < 0) {
            this.dx += amnt;
        }

        if (this.dy > 0) {
            this.dy -= amnt;
        } else if (this.dy < 0) {
            this.dy += amnt;
        }
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
    }

    get x() {
        return this._x;
    }

    set x(num) {
        this._x = num;
    }

    get y() {
        return this._y;
    }

    set y(num) {
        this._y = num;
    }

    get dy() {
        return this._dy;
    }

    set dy(num) {
        this._dy = num;
    }

    get dx() {
        return this._dx;
    }

    set dx(num) {
        this._dx = num;
    }

    /**
     * Flips the sign of the delta X (the change in distance on the X-axis).
     */
    flipDx() {
        this._dx = -this._dx;
    }

    /**
     * Flips the sign of the delta Y (the change in distance on the Y-axis).
     */
    flipDy() {
        this._dy = -this._dy;
    }

    get radius() {
        return this._ballRadius;
    }
}

export {Ball};
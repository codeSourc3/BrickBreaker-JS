/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */

import { Ball } from "./ball.js";

/**
 * 
 */
class Brick {
    constructor(x, y, status, brickWidth = 75, brickHeight = 20) {
        this._x = x;
        this._y = y;
        this._brickWidth = brickWidth;
        this._brickHeight = brickHeight;
        this._status = status;
    }


    draw(ctx) {
        ctx.save();
        ctx.rect(this._x, this._y, this._brickWidth, this._brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.restore();
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set y(num) {
        this._y = num;
    }

    set x(num) {
        this._x = num;
    }


    get width() {
        return this._brickWidth;
    }

    /**
     * Gets the height of the brick.
     * @returns a number 
     */
    get height() {
        return this._brickHeight;
    }

    damage(damageAmount=1) {
        this._status -= damageAmount;
    }

    isDestroyed() {
        return this._status <= 0;
    }

    
}

class Bricks {
    constructor(rowCount = 3, colCount = 5, padding = 10, offsetTop = 30, offsetLeft = 30) {
        this._rowCount = rowCount;
        this._colCount = colCount;
        this._padding = padding;
        this._offsetTop = offsetTop;
        this._offsetLeft = offsetLeft;
        /**
         * @type {Brick[][]}
         */
        this._bricks = [];
        for (let c = 0; c < this._colCount; c++) {
            this._bricks[c] = [];
            for (let r = 0; r < this._rowCount; r++) {
                this._bricks[c][r] = new Brick(0,0, 1);
                
            }
        }
        console.info(this._bricks);
    }

    static dimensions(brick) {
        return {
            width: brick.width,
            height: brick.height
        };
    }

    draw(ctx) {
        
        for (let c = 0; c < this._colCount; c++) {
            for (let r = 0; r < this._rowCount; r++) {
                if (!this._bricks[c][r].isDestroyed()) {
                    let brickX = (c * (this._bricks[c][r].width + this._padding)) + this._offsetLeft;
                    let brickY = (r * (this._bricks[c][r].height + this._padding)) + this._offsetTop;
                    this._bricks[c][r].x = brickX;
                    this._bricks[c][r].y = brickY;
                    //ctx.beginPath();
                    this._bricks[c][r].draw(ctx);
                    //ctx.closePath();
                }
            }
        }
        
    }

    /**
     * 
     * @param {Ball} ball the ball
     */
    intersects(ball) {
        for (let c = 0; c < this._colCount; c++) {
            for (let r = 0; r < this._rowCount; r++) {
                let b = this._bricks[c][r];
                // if brick isn't destroyed.
                if (!b.isDestroyed()) {
                    // if center of ball to be inside brick the following must = true
                    if (ball.x > b.x && ball.x < b.x + b.width && ball.y > b.y && ball.y < b.y + b.height) {
                        ball.flipDy();
                        b.damage();
                        console.info({b});
                    }
                }
            }
        }
    }

    /**
     * Checks if all bricks are destroyed.
     * @returns {boolean} true if all bricks are destroyed.
     */
    allBricksDestroyed() {
        // return true if all bricks are destroyed
        let allDestroyed = this._bricks.flat().every(b => b._status === 0);
        
        //console.info('All bricks destroyed', this._bricks.flat().every(b => b.isDestroyed()));
        return allDestroyed;
    }
    

}
export {Brick, Bricks};

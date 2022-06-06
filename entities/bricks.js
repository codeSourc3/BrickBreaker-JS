/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */

import { Globals } from "../game.js";
import { normalizeBox, rescaleBox } from "../math/sizing.js";
import { Ball } from "./ball.js";
import { GameObject } from './GameObject.js';

/**
 * 
 */
class Brick extends GameObject {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} status 
     * @param {number} brickWidth 
     * @param {number} brickHeight 
     */
    constructor(x, y, status, brickWidth = 75, brickHeight = 20) {
        super();
        this._x = x;
        this._y = y;
        this._brickWidth = brickWidth;
        this._brickHeight = brickHeight;
        this._status = status;
        // Normalized dimensions.
        this._normalized = normalizeBox(this._x, this._y, this._brickWidth, this._brickHeight);
    }


    draw(ctx) {
        if (this.isDestroyed()) return;
        ctx.save();
        ctx.rect(this._x, this._y, this._brickWidth, this._brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.restore();

    }

    update(elapsed) {
        //
    }

    rescale() {
        let { x, y, width, height } = rescaleBox(this._normalized);
        this._normalized = normalizeBox(x, y, width, height);
        //console.info('Brick X: ', this._x, 'Brick Y: ', this._y);
        this._x = x;
        this._y = y;
        this._brickWidth = width;
        this._brickHeight = height;
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
     * Sets the brick of the width.
     * @param {number} value the value.
     */
    set width(value) {
        this._brickWidth = Number(value);
    }

    /**
     * Gets the height of the brick.
     * @returns a number 
     */
    get height() {
        return this._brickHeight;
    }

    /**
     * Sets the height of the brick.
     * @param {number} value the value.
     */
    set height(value) {
        this._brickHeight = Number(value);
    }

    /**
     * Checks if the ball collides with the brick.
     * @param {Ball} ball 
     * @returns {boolean}
     */
    collidesWith(ball) {
        return (ball.x > this._x && ball.x < this._x + this._brickWidth && ball.y > this._y && ball.y < this._y + this._brickHeight);
    }

    damage(damageAmount = 1) {
        this._status -= damageAmount;
    }

    isDestroyed() {
        return this._status <= 0;
    }


}

/**
 * 
 * @param {number} rowCount 
 * @param {number} colCount 
 * @param {number} brickWidth 
 * @param {number} brickHeight 
 * @returns {Brick[][]}
 */
function buildBrickField(rowCount, colCount, brickWidth, brickHeight) {
    const bricks = [];
    for (let row = 0; row < rowCount; row++) {
        let parsedRow = [];
        for (let col = 0; col < colCount; col++) {
            parsedRow.push(new Brick(0, 0, 1, brickWidth, brickHeight));
        }
        bricks.push(parsedRow);
    }
    console.assert(bricks.length > 0, 'Problem building brick field');
    return bricks;
}

/**
 * 
 * @param {Array<Array<Number>>} levelData 
 * @returns {Brick[][]}
 */
function parseLevelData(levelData, brickWidth, brickHeight) {
    const bricks = [];
    for (let row = 0; row < levelData.length; row++) {
        let parsedRow = [];
        for (let col = 0; col < levelData[row].length; col++) {
            let health = Number(levelData[row][col]);
            parsedRow.push(new Brick(0, 0, health, brickWidth, brickHeight));
        }
        bricks.push(parsedRow);
    }
    console.assert(bricks.length > 0, 'Problem parsing level data');
    return bricks;
}

class Bricks extends GameObject {
    constructor(rowCount = 3, colCount = 5, padding = 10, offsetTop = 30, offsetLeft = 30) {
        super();
        /**
         * @private
         */
        this._rowCount = rowCount;
        /**
         * @private
         */
        this._colCount = colCount;
        /**
         * @private
         */
        this._padding = padding;
        /**
         * @private
         */
        this._offsetTop = offsetTop;
        /**
         * @private
         */
        this._offsetLeft = offsetLeft;
        let brickWidth = Globals.getGameDimensions().width - offsetLeft;
        brickWidth = brickWidth - (padding * colCount);
        brickWidth /= colCount;

        let brickHeight = Globals.getGameDimensions().height / 2 - offsetTop;
        brickHeight -= padding * rowCount;
        brickHeight /= rowCount;
        /**
         * @private
         */
        this._bricks = buildBrickField(rowCount, colCount, brickWidth, brickHeight);
    }

    set colCount(value) {
        this._colCount = Number(value);
    }

    set padding(value) {
        this._padding = Number(value);
    }

    set rowCount(value) {
        this._rowCount = Number(value);
    }

    set offsetTop(value) {
        this._offsetTop = Number(value);
    }

    set offsetLeft(value) {
        this._offsetLeft = Number(value);
    }

    /**
     * @param {Brick[][]}
     */
    set bricks(value) {
        if (Array.isArray(value)) {
            if (value.every(subarray => Array.isArray(subarray))) {
                this._bricks = value;
                this._colCount = value[0].length;
                this._rowCount = value.length;
            }
        }
    }

    /**
     * Constructs a brick field from level data.
     * @param {number[][]} levelData data representing the health of each brick.
     * @returns {Bricks}
     */
    static fromArray(levelData, padding = 10, offsetTop = 30, offsetLeft = 30) {
        let rowCount = levelData.length;
        let colCount = levelData[0].length;
        
        let brickWidth = Globals.getGameDimensions().width - offsetLeft;
        brickWidth = brickWidth - (padding * colCount);
        brickWidth /= colCount;

        let brickHeight = Globals.getGameDimensions().height / 2 - offsetTop;
        brickHeight -= padding * rowCount;
        brickHeight /= rowCount;

        let bricks = parseLevelData(levelData, brickWidth, brickHeight);
        const field = new Bricks();
        field.bricks = bricks;
        field.colCount = bricks[0].length;
        field.rowCount = bricks.length;
        return field;

    }

    /**
     * 
     * @param {Brick} brick 
     * @returns {{width: number, height: number}}
     */
    static dimensions(brick) {
        return {
            width: brick.width,
            height: brick.height
        };
    }

    draw(ctx) {
        console.log('Columns: ', this._colCount, ' Rows: ', this._rowCount);
        for (let row = 0; row < this._rowCount; row++) {
            for (let col = 0; col < this._colCount; col++) {
                

                let brickX = (col * (this._bricks[row][col].width + this._padding)) + this._offsetLeft;
                let brickY = (row * (this._bricks[row][col].height + this._padding)) + this._offsetTop;
                this._bricks[row][col].x = brickX;
                this._bricks[row][col].y = brickY;
                //ctx.beginPath();
                this._bricks[row][col].draw(ctx);
                //ctx.closePath();

            }
        }

    }

    /**
     * 
     * @param {Ball} ball the ball
     * @param {(brick:Brick) => void} callback
     */
    intersects(ball, callback) {
        for (let c = 0; c < this._rowCount; c++) {
            for (let r = 0; r < this._colCount; r++) {
                console.info(`C: ${c}, R: ${r}`);
                let brick = this._bricks[c][r];
                // if brick isn't destroyed.
                if (!brick.isDestroyed()) {
                    // if center of ball to be inside brick the following must = true
                    if (brick.collidesWith(ball)) {
                        callback(brick);
                    }
                }
            }
        }
    }

    /**
     * Resizes the bricks.
     */
    recalculateSize() {
        this._bricks.flat().forEach(brick => {
            brick.rescale();
        });

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
export { Brick, Bricks };

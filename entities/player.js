/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
/**
 * Player has lives, score, current level,
 * and controls the game. They can pause the game
 * They can resume the game, they can quit, 
 * and control the paddle.
 */
// Class or object literal. Only need one. However it would be easier using classes.
class Player {
    constructor(lives = 3) {
        this._score = 0;
        this._lives = lives;
    }

    decrementLife(amnt = 1) {
        if (this._lives > 0) {
            this._lives -= amnt;
        }
    }

    incrementLife(amnt = 1) {
        if (amnt > 0) {
            this._lives += amnt;
        }
    }

    increaseScore(amnt = 1) {
        if (amnt > 0) {
            this._score += amnt;
        }
    }

    get lives() {
        return this._lives;
    }

    get score() {
        return this._score;
    }

    /**
     * Draws player score and lives.
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        // Draw score
        ctx.save();
        ctx.font = '16px Arial';
        ctx.fillStyle =  '#0095DD';
        ctx.fillText('Score: ' + this._score, 8, 20);
        ctx.restore();
        // Draw lives
        ctx.save();
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Lives: ' + this._lives, ctx.canvas.width - 65, 20);
        ctx.restore();
    }
}

export {Player};
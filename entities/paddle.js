import { Globals } from "../game.js";

/**
 * Handles ball width, height and responds to events
 */
class Paddle {
	/**
	 * Paddle is fixed at its Y-axis
	 */
	constructor(paddleX, paddleHeight, paddleWidth) {
		this._paddleX = paddleX;
		this._paddleHeight = paddleHeight;
		this._paddleWidth = paddleWidth;
		this._rightPressed = false;
		this._leftPressed = false;
	}
	
	draw(context) {
        context.save();
		context.beginPath();
		context.rect(
			this._paddleX,
			context.canvas.height - this._paddleHeight,
			this._paddleWidth,
			this._paddleHeight);
		context.fillStyle = '#0095DD';
		context.fill();
        context.closePath();
        context.restore();
        
        if(this._rightPressed) {
            this._paddleX += 7;
            if (this._paddleX + this._paddleWidth > context.canvas.width){
                this._paddleX = context.canvas.width - this._paddleWidth;
            }
        }
        else if(this._leftPressed) {
            this._paddleX -= 7;
            if (this._paddleX < 0){
                this._paddleX = 0;
            }
        }
    }
    
    get paddleX() {
        return this._paddleX;
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
     * @param {Event} evt the code handles keydown, keyup, and pointermove
     */
    handleEvent(evt) {
        
        if (evt.type === 'keydown') {
            if (evt.key === 'ArrowLeft' || evt.key === 'Left' || evt.key === 'a' ) {
                this._leftPressed = true;
                evt.preventDefault();
            } else if (evt.key === 'ArrowRight' || evt.key === 'Right' || evt.key === 'd') {
                this._rightPressed = true;
                evt.preventDefault();
            }
        } else if (evt.type === 'keyup') {
            if (evt.key === 'ArrowLeft' || evt.key === 'Left' || evt.key === 'a') {
                this._leftPressed = false;
                evt.preventDefault();
            } else if (evt.key === 'ArrowRight' || evt.key === 'Right' || evt.key === 'd') {
                this._rightPressed = false;
                evt.preventDefault();
            }
        }

        if (evt.type === 'pointermove') {
            let relativeX = evt.clientX - Globals.getCanvasElement().offsetLeft;
            if (relativeX > 0 && relativeX < Globals.getCanvasElement().width) {
                this._paddleX = relativeX - this._paddleWidth / 2;
                if (this._paddleX < 0) {
                    this._paddleX = 0;
                }
                if (this._paddleX + this._paddleWidth > Globals.getGameDimensions().width) {
                    this._paddleX = Globals.getGameDimensions().width - this._paddleWidth;
                }
            }
        }
        
    }

    
}

export {Paddle};

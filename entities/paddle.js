/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import { Globals } from "../game.js";
import { GameObject } from  './GameObject.js';

/**
 * Handles ball width, height and responds to events
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

   _onKeyDown(evt) {
       if (evt.key === 'ArrowLeft' || evt.key === 'Left' || evt.key === 'a' ) {
            this._leftPressed = true;
            evt.preventDefault();
        } else if (evt.key === 'ArrowRight' || evt.key === 'Right' || evt.key === 'd') {
            this._rightPressed = true;
            evt.preventDefault();
        }
   }

   _onKeyUp(evt) {
        if (evt.key === 'ArrowLeft' || evt.key === 'Left' || evt.key === 'a') {
            this._leftPressed = false;
            evt.preventDefault();
        } else if (evt.key === 'ArrowRight' || evt.key === 'Right' || evt.key === 'd') {
            this._rightPressed = false;
            evt.preventDefault();
        }
   }

   _onPointerMove(evt) {
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

    /**
     * 
     * @param {Event} evt the code handles keydown, keyup, and pointermove
     */
    handleEvent(evt) {
        switch(evt.type) {
            case 'keydown':
                this._onKeyDown(evt);
                break;
            case 'keyup':
                this._onKeyUp(evt);
                break;
            case 'pointermove':
                this._onPointerMove(evt);
                break;
        }
        
        
    }

    
}

export {Paddle};
/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import { State } from "./state.js";
import { Paddle } from '../entities/paddle.js';
import { Ball } from '../entities/ball.js';
import { Globals } from '../game.js';
import { Bricks } from '../entities/bricks.js';
import { WinGameState } from "./WinGameState.js";
import { GameOverState } from './gameoverstate.js';
import { levels } from './leveldata.js';
import { GameObject } from "../entities/GameObject.js";

/**
 * Base class for all levels.
 * @interface
 */
export class RunningGameState extends State {
    /**
     * Constructs a level state.
     * @param {import('../entities/player.js').Player} player the current player.
     * @param {Bricks} bricks the bricks object.
     * @param {string} title the title of the level
     */
    constructor(player, bricks, title = 'Level ???') {
        super(title);
        /**
         * @private
         */
        this._player = player;
        
        
        const context = Globals.getCanvasElement();
        const paddleWidth = context.width / 10;
        const paddleHeight = context.height / 25;
        /**
         * @private
         */
        this._paddle = new Paddle((context.width - paddleWidth) / 2, paddleHeight, paddleWidth);
        const x = context.width / 2;
        const y = context.height - 30;
        const ballRadius = Math.min(context.height, context.width) / 30;
        /**
         * @private
         */
        this._ball = new Ball(x, y, ballRadius);
        /**
         * @private
         */
        this._currentLevel = 0;
        /**
         * @private
         */
        this._levels = levels;
        /**
         * @private
         */
        this._maxLevels = levels.length;
        /**
         * @private
         */
        this._bricks = bricks;
        /**
         * @private
         */
        this._isPaused = false;
        /**
         * @private
         */
        this._ballData = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        };
    }

    /**
      * Called before render. Updates the game state.
      * 
      * @param {number} elapsed the elapsed amount of time since the last frame.
      */
    updateState(elapsed) {

        let canvas = Globals.getCanvasElement();
        
        this._bricks.intersects(this._ball, brick => {
            brick.damage();
            this._ball.flipDy();
            this._player.increaseScore();
        });
        if (this._bricks.allBricksDestroyed()) {
            console.info('All bricks destroyed');
            this.onWin();
            
        }
        this._bricks.recalculateSize();
        // Do collision detecton
        if (this._ball.y + this._ball.dy > canvas.height - this._ball.radius) {
            if (this._ball.x > this._paddle.paddleX && this._ball.x < this._paddle.paddleX + this._paddle.paddleWidth) {
                this._ball.dy = -this._ball.dy;
            } else {
                this._player.decrementLife();
                if (this._player.lives == 0) {
                    this.onExit();
                    Globals.getGameInstance().push(new GameOverState());
                } else {
                    this._ball.reset();
                    this._paddle.paddleX = (canvas.width - this._paddle.paddleWidth) / 2;
                }
            }
        }

        // Apply movement
        this._ball.update(elapsed);
    }

    nextLevel() {
        this._currentLevel++;
    }

    /**
     * Called after render. Draws the state to the screen.
     * @param {CanvasRenderingContext2D} ctx the canvas rendering context.
     */
    renderState(ctx) {
        ctx.clearRect(0, 0, Globals.getCanvasElement().width, Globals.getCanvasElement().height);
        // Draw player info
        this._player.draw(ctx);
        //this._bricks.recalculateSize();
        this._paddle.draw(ctx);
        this._ball.draw(ctx);
        this._bricks.draw(ctx);
    }


    /**
     * Will not be removed until exit.
     * @private
     * @param {KeyboardEvent} ev
     */
    _pauseHandler(ev) {
        if (ev.type === 'keypress' && ev.key === 'p') {
            if (this._isPaused) {
                Globals.resumeGame();
                this._isPaused = false;
            } else {
                Globals.pauseGame();
                this._isPaused = true;
            }
        }
    }


    /**
     * Can set up the environment here (event listeners, etc.)
     */
    onEnter() {
        // Add pointer listener

        // Add key listener for paddle
        window.addEventListener('keydown', this._paddle);
        window.addEventListener('keyup', this._paddle);
        window.addEventListener('pointermove', this._paddle);

        // Add key listener for pausing and resuming the game
        window.addEventListener('keypress', this._pauseHandler);
        // Add gamepad listener
    }

    /**
     * Called right before the state shuts down.
     * Can be used to clean up or save the state at that point.
     */
    onExit() {
        // Remove pointer listener(s).

        // Remove key listener(s);
        console.log('Exiting Game state');
        window.removeEventListener('keydown', this._paddle, true);
        window.removeEventListener('keyup', this._paddle, true);
        window.removeEventListener('pointermove', this._paddle, true);
        window.removeEventListener('keypress', this._pauseHandler);
        // Remove gamepad listener(s).
    }

    /**
     * Called when the game/state is paused.
     */
    onPause() {
        // Pause the game
        // Disable paddle movement
        console.info('Pausing Level');
        window.removeEventListener('keydown', this._paddle);
        window.removeEventListener('keyup', this._paddle);
        window.removeEventListener('pointermove', this._paddle);

        // Save ball velocity
        this._ballData.x = this._ball.x;
        this._ballData.y = this._ball.y;
        this._ballData.dx = this._ball.dx;
        this._ballData.dy = this._ball.dy;

        // Disable ball movement
        this._ball.stop();
        console.log('Game paused');

        // Push InGameMenuState onto stack
    }

    /**
     * Abstract method extended by subclasses. For example: 
     * going to the next level when we want.
     */
    onWin() {
        if (this._currentLevel > this._maxLevels) {
            // all levels won
            console.info('All levels won');
            this.onExit();
            Globals.getGameInstance().push(new WinGameState());
        } else {
            // next level
            console.info('Next level');
            this.nextLevel();
            this._ball.reset();
            this._bricks = Bricks.fromArray(this._levels[this._currentLevel]);
        }
    }

    /**
     * Called before the game is reinstated.
     */
    onResume() {

        // InGameMenuState does: Globals.getGameInstance().pop(); Globals.resume();
        window.addEventListener('keydown', this._paddle);
        window.addEventListener('keyup', this._paddle);
        window.addEventListener('pointermove', this._paddle);
        this._ball.dx = this._ballData.dx;
        this._ball.dy = this._ballData.dy;
        console.log('Game resumed.');
    }
}

/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import { State } from "./state.js";
import { Paddle } from '../entities/paddle.js';
import { Ball } from '../entities/ball.js';
import { Game, Globals } from '../game.js';
import { Bricks } from '../entities/bricks.js';
import { WinGameState } from "./WinGameState.js";
import { GameOverState } from './gameoverstate.js';
import { levels } from './leveldata.js';
import { bounceOffPaddle, isCircleCollidingWithRect } from "../math/collisions.js";
import { PauseMenu } from "./PauseMenu.js";

/**
 * Base class for all levels.
 * @interface
 */
export class RunningGameState extends State {
    /**
     * Constructs a level state.
     * @param {import('../entities/player.js').Player} player the current player.
     * @param {Game} game the game instance for interacting with subsystems.
     * @param {Bricks} bricks the bricks object.
     * @param {string} title the title of the level
     */
    constructor(player, game, bricks, title = 'Level ???') {
        super(title, game);
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

        this._pauseHandler = this._pauseHandler.bind(this);

        this.addGameObject(this._player);
        this.addGameObject(this._paddle);
        this.addGameObject(this._bricks);
        this.addGameObject(this._ball);

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
            if (isCircleCollidingWithRect(this._ball, this._paddle)) {
                bounceOffPaddle(this._ball, this._paddle);
                 
            } else {
                this._player.decrementLife();
                if (this._player.lives == 0) {
                    this.onExit();
                    this.game.events.emit(Game.Events.CHANGE_STATE, new GameOverState(this.game));
                } else {
                    this._ball.reset();
                    this._paddle.paddleX = (canvas.width - this._paddle.paddleWidth) / 2;
                }
            }
        }

        // Apply movement
        super.updateState(elapsed);
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
        super.renderState(ctx);
    }


    /**
     * Will not be removed until exit.
     * @private
     * @param {KeyboardEvent} ev
     */
    _pauseHandler(ev) {
        if (ev.type === 'keypress' && ev.key === 'p') {
            this.game.events.emit(Game.Events.SLEEP);
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

    onSleep() {
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
        this.game.events.emit(Game.Events.PUSH_STATE, new PauseMenu(this.game));
        console.debug('GameState\'s onSleep() executed.');
    }

    /**
     * Abstract method extended by subclasses. For example: 
     * going to the next level when we want.
     */
    onWin() {
        if (this._currentLevel + 1 >= this._maxLevels) {
            // all levels won
            console.info('All levels won');
            this.onExit();
            this.game.events.emit(Game.Events.CHANGE_STATE, new WinGameState(this.game));
        } else {
            // next level
            console.info('Next level');
            this.nextLevel();
            this._ball.reset();
            let previousBrickField = this._bricks;
            this.removeGameObject(previousBrickField);
            this._bricks = Bricks.fromArray(this._levels[this._currentLevel]);
            this.addGameObject(this._bricks);
        }
    }

    onWakeUp() {
        window.addEventListener('keydown', this._paddle);
        window.addEventListener('keyup', this._paddle);
        window.addEventListener('pointermove', this._paddle);
        this._ball.dx = this._ballData.dx;
        this._ball.dy = this._ballData.dy;
        console.debug('Waking up GameState');
        
    }
}

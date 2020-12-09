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

const ENTITY_LIMIT = 50;
/**
 * Base class for all levels.
 * @interface
 */
export class LevelState extends State {
    constructor(player, bricks, title = 'Level ???') {
        super(title);
        this._player = player;
        
        
        const context = Globals.getCanvasElement();
        const paddleWidth = context.width / 10;
        const paddleHeight = context.height / 25;
        this._paddle = new Paddle((context.width - paddleWidth) / 2, paddleHeight, paddleWidth);
        const x = context.width / 2;
        const y = context.height - 30;
        const ballRadius = Math.min(context.height, context.width) / 30;
        this._ball = new Ball(x, y, ballRadius);
        this._bricks = new Bricks(5, 10, 10);
        this._isPaused = false;
        this._ballData = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        };
    }

    /**
      * Called before render. Updates the game state.
      */
    update() {

        let canvas = Globals.getCanvasElement();

        this._bricks.intersects(this._ball, (ball, brick) => {
            ball.flipDy();
            brick.damage();
        });
        if (this._bricks.allBricksDestroyed()) {
            this.onWin();
        }
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
                    this._ball.x = canvas.width / 2;
                    this._ball.y = canvas.height - 30;
                    this._ball.dx = 2;
                    this._ball.dy = -2;
                    this._paddle.paddleX = (canvas.width - this._paddle.paddleWidth) / 2;
                }
            }
        }



        // Apply movement
        this._ball.update();
    }

    /**
     * Called after render. Draws the state to the screen.
     * @param {CanvasRenderingContext2D} ctx the canvas rendering context.
     */
    render(ctx) {
        ctx.clearRect(0, 0, Globals.getCanvasElement().width, Globals.getCanvasElement().height);
        // Draw player info
        this._player.draw(ctx);
        this._paddle.draw(ctx);
        this._ball.draw(ctx);
        this._bricks.draw(ctx);
    }


    /**
     * Will not be removed until exit.
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
        window.removeEventListener('keydown', this._paddle, true);
        window.removeEventListener('keyup', this._paddle, true);
        window.removeEventListener('pointermove', this._paddle, true);

        // Save ball velocity
        this._ballData.x = this._ball.x;
        this._ballData.y = this._ball.y;
        this._ballData.dx = this._ball.dx;
        this._ballData.dy = this._ball.dy;

        // Disable ball movement
        this._ball.dx = 0;
        this._ball.dy = 0;
        console.log('Game paused');

        // Push InGameMenuState onto stack
    }

    /**
     * Abstract method extended by subclasses. For example: 
     * going to the next level when we want.
     */
    onWin() {
        this.onExit();
        Globals.getGameInstance().push(new WinGameState());
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

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
import { Pointer } from "../input/pointer.js";
import { Vec2 } from "../math/vec2.js";
import keyboard, { KeyboardManager, Keys } from "../input/keyboard.js";

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
        this._isAiming = true;
        this._levelDelay = 100;
        this._currentDelay = this._levelDelay;

        this._pauseHandler = this._pauseHandler.bind(this);
        this.handlePaddleKeyDown = this.handlePaddleKeyDown.bind(this);
        this.handlePaddleKeyUp = this.handlePaddleKeyUp.bind(this);
        this.bindToSelf(this.turnCursorLeft);
        this.bindToSelf(this.turnCursorRight);
        this.addGameObject(this._player);
        this.addGameObject(this._paddle);
        this.addGameObject(this._bricks);
        this.addGameObject(this._ball);
        keyboard.bindKeys('pausegame', 'p');
        /**
         * @private
         */
        this._ballData = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0
        };

        this._aiming = {
            dx: 0,
            dy: 0
        };


        this._aimingAngle = 0;
    }

    /**
      * Called before render. Updates the game state.
      * 
      * @param {number} elapsed the elapsed amount of time since the last frame.
      */
    updateState(elapsed) {

        let canvas = this.game.dimensions;

        if (!this._isAiming) {
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
                        this._ball.stop();
                        this._paddle.paddleX = (canvas.width - this._paddle.paddleWidth) / 2;
                        this.enableAiming();
                    }
                }
            }
        } else if (Pointer.getInstance().lastUpdated >= keyboard.lastRelevantInput) {
            const pointer = Pointer.getInstance();
            this.aim(pointer);
            if (pointer.wasClicked && this._currentDelay <= 0) {
                this.fire(3);
                console.debug('Was fired');
            }

        }

        // Apply movement
        super.updateState(elapsed);
    }

    /**
     * 
     * @param {{x: number, y: number}} pos 
     */
    aim(pos) {
        
        const ballPos = this._ball.center;
        let dx = pos.x - ballPos.x;
        let dy = pos.y - ballPos.y;
        if (dy > -(this._ball.radius * 2)) {
            // aiming towards bottom of screen. Can't have that.
            dy = -(this._ball.radius * 2);
        }
        let dl = Math.sqrt(dx * dx + dy * dy);
        dx /= dl;
        dy /= dl;
        this._aiming.dx = dx;
        this._aiming.dy = dy;
        this._currentDelay--;
    }

    /**
     * 
     * @param {number} speed 
     */
    fire(speed) {
        this._ball.dx = this._aiming.dx * speed;
        this._ball.dy = this._aiming.dy * speed;
        this.disableAiming();
        console.assert(!this._paddle.disabled, 'Paddle input was not enabled.');
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
        if (this._isAiming) {
            const ballPos = this._ball.center;
            this.drawCursor(ctx, ballPos.x, ballPos.y, this._aiming.dx, this._aiming.dy);
        }
        // Draw player info
        super.renderState(ctx);
    }

    drawCursor(ctx, objectX, objectY, dx, dy) {
        ctx.beginPath();
        ctx.moveTo(objectX, objectY);
        ctx.lineTo(objectX + dx * 100, objectY + dy * 100);
        ctx.stroke();
    }


    /**
     * Will not be removed until exit.
     * @private
     * @param {string} key
     */
    _pauseHandler(key, action) {
        if (action === 'pausegame') {
            this.game.events.emit(Game.Events.SLEEP);
        }
    }


    /**
     * Can set up the environment here (event listeners, etc.)
     */
    onEnter() {
        // Add pointer listener
        this.registerControls();
        // Add key listener for paddle
        this.enableAiming();

        // Add key listener for pausing and resuming the game
        keyboard.events.subscribe(KeyboardManager.KEY_UP, this._pauseHandler);
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
        this.unregisterControls();
        keyboard.unbindAll();

        keyboard.events.unsubscribe(KeyboardManager.KEY_UP, this._pauseHandler);

        // Remove gamepad listener(s).

        // Remove game objects
        this.removeGameObject(this._player);
        this.removeGameObject(this._ball);
        this.removeGameObject(this._bricks);
        this.removeGameObject(this._paddle);
    }

    onSleep() {
        keyboard.events.unsubscribe(KeyboardManager.KEY_UP, this._pauseHandler);
        this.unregisterControls();
        this.disablePaddleMovement();
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
            this._ball.stop();
            this._paddle.paddleX = (this.game.canvas.width - this._paddle.paddleWidth) / 2;
            let previousBrickField = this._bricks;
            this.removeGameObject(previousBrickField);
            this._bricks = Bricks.fromArray(this._levels[this._currentLevel]);
            this.addGameObject(this._bricks);
            this.enableAiming();
        }
    }

    onWakeUp() {
        this.registerControls();
        if (this._isAiming) {
            this.enableAiming();
        } else {
            this.enablePaddleMovement();
        }
        keyboard.events.subscribe(KeyboardManager.KEY_UP, this._pauseHandler);
        this._ball.dx = this._ballData.dx;
        this._ball.dy = this._ballData.dy;
        console.debug('Waking up GameState');

    }

    unregisterControls() {
        keyboard.events.unsubscribe(KeyboardManager.KEY_DOWN, this.handlePaddleKeyDown);
        keyboard.events.unsubscribe(KeyboardManager.KEY_UP, this.handlePaddleKeyUp);
    }

    registerControls() {
        keyboard.events.subscribe(KeyboardManager.KEY_DOWN, this.handlePaddleKeyDown);
        keyboard.events.subscribe(KeyboardManager.KEY_UP, this.handlePaddleKeyUp);
    }

    disablePaddleMovement() {
        keyboard.unbindKeys('a', Keys.ARROW_LEFT, Keys.ARROW_RIGHT, 'd', 'Left', 'Right');
        this._paddle.disablePointerInput();
    }

    enablePaddleMovement() {
        keyboard.bindKeys('movepaddleleft', 'a', Keys.ARROW_LEFT, 'Left');
        keyboard.bindKeys('movepaddleright', 'd', Keys.ARROW_RIGHT, 'Right');
        this._paddle.enablePointerInput();
    }

    /**
     * 
     * @param {string} key the KeyboardEvent.key
     */
    handlePaddleKeyDown(key, action, repeats) {
        if (action === 'movepaddleleft') {
            this._paddle.moveLeft(keyboard.lastRelevantInput);
        } else if (action === 'movepaddleright') {
            this._paddle.moveRight(keyboard.lastRelevantInput);
        }
        if (action === 'turncursorright') {
            this.turnCursorRight(5);
        } else if (action === 'turncursorleft') {
            this.turnCursorLeft(5);
        }
    }

    turnCursorLeft(amount) {
        let currentX = this._aiming.dx;
        let currentY = this.game.canvas.height / 2;
        this.aim({x: Math.abs(currentX - amount), y: currentY});
    }

    turnCursorRight(amount) {
        let gameCanvas = this.game.canvas;
        let currentX = this._aiming.dx;
        let currentY = this.game.canvas.height / 2;
        this.aim({x: Math.min(currentX + amount, gameCanvas.width), y: currentY});
    }

    /**
     * 
     * @param {string} key the KeyboardEvent.key
     */
    handlePaddleKeyUp(key, action) {
        if (action === 'movepaddleleft' || action === 'movepaddleright') {
            this._paddle.resetMovement(keyboard.lastRelevantInput);
        } else if (action === 'fire') {
            this.fire(3);
        }
    }

    /**
     * Disables paddle movement as well as enabling aiming.
     */
    enableAiming() {
        this.disablePaddleMovement();
        keyboard.bindKeys('turncursorleft', 'a', Keys.ARROW_LEFT, 'Left');
        keyboard.bindKeys('turncursorright', 'd', Keys.ARROW_RIGHT, 'Right');
        keyboard.bindKeys('fire', Keys.SPACE);
        this._isAiming = true;
        this._currentDelay = this._levelDelay;
        
    }

    disableAiming() {
        this._isAiming = false;
        keyboard.unbindKeys('a', Keys.ARROW_LEFT, 'Left', 'd', Keys.ARROW_RIGHT, 'Right', Keys.SPACE);
        this.enablePaddleMovement();
    }
}

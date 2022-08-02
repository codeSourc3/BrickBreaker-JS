/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import {State} from './state.js';
import {centerText, Button, ButtonGroup} from '../ui/components.js';
import {Globals, Game} from '../game.js';
import { Pointer } from "../input/pointer.js";
import keyboard, { KeyboardManager, Keys } from '../input/keyboard.js';

const noop = () => {
    return;
};

export class GameOverState extends State {
    /**
     * 
     * @param {import('../game.js').Game} game 
     */
    constructor(game) {
        super('GameOver', game);
        /**
         * @type {ButtonGroup}
         */
         this.buttonGroup = new ButtonGroup(game.canvas, game.canvas.height / 2);
         this._inputActionMap = new Map([
            ['w', 'moveup'],
            [Keys.ARROW_UP, 'moveup'],
            ['Up', 'moveup'],
            ['s', 'movedown'],
            [Keys.ARROW_DOWN, 'movedown'],
            ['Down', 'movedown'],
            [Keys.ENTER, 'selectcurrentbutton'],
            [Keys.SPACE, 'selectcurrentbutton']
        ]);

        this._keyDownHandler = key => {
            if (this._inputActionMap.has(key)) {
                const action = this._inputActionMap.get(key);
                switch (action) {
                    case 'moveup':
                        this.buttonGroup.moveUp();
                        console.info('Move up ', this.buttonGroup.currentSelected.text)
                        break;
                    case 'movedown':
                        this.buttonGroup.moveDown();
                        console.info('Move down ', this.buttonGroup.currentSelected.text);
                        break;
                    case 'selectcurrentbutton':
                        this.buttonGroup.selectCurrent();
                        break;
                    default:
                        noop();
                        break;
                }
            }
        };
        this.bindToSelf(this._keyDownHandler);
         this.backToMainMenuCb = () => {
             this.game.events.emit(Game.Events.POP_STATE);
             this.game.events.emit(Game.Events.WAKE_UP_STATE);
         };
         this.bindToSelf(this.backToMainMenuCb);
    }

    /**
      * Called before render. Updates the game state.
      * 
      * @param {number} elapsed the amount of time that elapsed since the last frame.
      */
     updateState(elapsed) {
        const pointer = Pointer.getInstance();
        if (!pointer.attached) {
            pointer.attach();
        }
        if (this.buttonGroup.intersectsXY(pointer) && pointer.wasClicked) {
            this.buttonGroup.selectCurrent();
        }
        super.updateState(elapsed);
    }

    /**
     * Called after render. Draws the state to the screen.
     * @param {CanvasRenderingContext2D} ctx 
     */
    renderState(ctx) {
        ctx.clearRect(0, 0, Globals.getCanvasElement().width, Globals.getCanvasElement().height)
        // Display 'Game Over' in center of screen
        ctx.save();
        const fontSize = '2em';
        ctx.font = `${fontSize} monospace`;
        centerText(ctx, Globals.getGameDimensions().height / 3, 'Game Over');
        ctx.restore();
        // Display player's final score.
        super.renderState(ctx);
        // Display 'Back To Main Menu' button
    }

    /**
     * Can set up the environment here (event listeners, etc.)
     */
    onEnter() {
        keyboard.events.subscribe(KeyboardManager.KEY_DOWN, this._keyDownHandler);
        const buttonWidth = this.game.canvas.width / 6;
        const buttonHeight = this.game.canvas.height / 8;
        const buttonX = this.game.canvas.width / 2 - (this.game.canvas.width / 6) / 2;
        const backToMainMenuBtn = new Button('To Main Menu', 
            buttonX,
            this.game.canvas.height / 2,
            buttonWidth,
            buttonHeight
        );
        backToMainMenuBtn.setHandler(this.backToMainMenuCb);
        this.buttonGroup.add(backToMainMenuBtn);
        this.addGameObject(this.buttonGroup);
    }

    /**
     * Called right before the state shuts down.
     * Can be used to clean up or save the state at that point.
     */
    onExit() {
        keyboard.events.unsubscribe(KeyboardManager.KEY_DOWN, this._keyDownHandler);
    }

    /**
     * Called when the game/state is paused.
     */
    onPause() {

    }

    /**
     * Called before the game is reinstated.
     */
    onResume() {

    }
}


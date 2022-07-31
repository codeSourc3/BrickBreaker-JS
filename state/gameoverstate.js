/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import {State} from './state.js';
import {centerText, Button} from '../ui/components.js';
import {Globals, Game} from '../game.js';
import { Pointer } from "../input/pointer.js";

export class GameOverState extends State {
    /**
     * 
     * @param {import('../game.js').Game} game 
     */
    constructor(game) {
        super('GameOver', game);
        /**
         * @type {Button[]}
         */
         this.buttons = [];
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
        for (let i = 0, len = this.buttons.length; i < len; i++) {
            if (this.buttons[i].intersectsXY(pointer) && pointer.wasClicked) {
                this.buttons[i].handler();
                console.debug(`Game Over State button ${this.buttons[i].text} was clicked.`);
                break;
            }
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
        this.buttons.push(backToMainMenuBtn);
        this.addGameObject(backToMainMenuBtn);
    }

    /**
     * Called right before the state shuts down.
     * Can be used to clean up or save the state at that point.
     */
    onExit() {

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


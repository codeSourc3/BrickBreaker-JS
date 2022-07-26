/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import { Game, Globals } from "../game.js";
import { State } from "./state.js";
import {Button, centerText} from '../ui/components.js';
import { Pointer } from "../input/pointer.js";

export class WinGameState extends State {
    /**
     * 
     * @param {import('../game.js').Game} game 
     */
    constructor(game) {
        super('YouWin', game);
        this.title = 'You Win!';
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
     * 
     * @param {CanvasRenderingContext2D} ctx the canvas context.
     */
    renderState(ctx) {
        const dimensions = this.game.dimensions;
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        // Display 'Game Over' in center of screen
        ctx.save();
        const fontSize = '2em';
        ctx.fillStyle = 'black'
        ctx.font = `${fontSize} monospace`;
        centerText(ctx, this.game.canvas.height / 3, this.title);
        ctx.restore();
        super.renderState(ctx);
    }

    updateState(elapsed) {
        const pointer = Pointer.getInstance();
        if (!pointer.attached) {
            pointer.attach();
        }
        for (let i = 0, len = this.buttons.length; i < len; i++) {
            if (this.buttons[i].intersectsXY(pointer) && pointer.wasClicked) {
                this.buttons[i].handler();
                console.debug(`Win State button ${this.buttons[i].text} was clicked.`);
                break;
            }
        }
        super.updateState(elapsed);
    }

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


}

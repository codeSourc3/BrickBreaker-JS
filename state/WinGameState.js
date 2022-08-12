/**
 * @author Enzo Mayo
 * @since 12/09/2020
 */
import { Game, Globals } from "../game.js";
import { State } from "./state.js";
import {Button, centerText, ButtonGroup} from '../ui/components.js';
import { Pointer } from "../input/pointer.js";
import keyboard, { KeyboardManager, Keys } from "../input/keyboard.js";

export class WinGameState extends State {
    /**
     * 
     * @param {import('../game.js').Game} game 
     */
    constructor(game) {
        super('YouWin', game);
        this.title = 'You Win!';
        /**
         * @type {ButtonGroup}
         */
        this.buttonGroup = new ButtonGroup(game.canvas, game._canvas.height / 2);
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
        if (this.buttonGroup.intersectsXY(pointer) && pointer.wasClicked) {
            this.buttonGroup.selectCurrent();
        }
        super.updateState(elapsed);
    }

    onEnter() {
        keyboard.events.subscribe(KeyboardManager.KEY_DOWN, this._keyDownHandler);
        this.buttonGroup.append('To Main Menu', 0.5, this.backToMainMenuCb);
        this.addGameObject(this.buttonGroup);
    }

    onExit() {
        keyboard.events.unsubscribe(KeyboardManager.KEY_DOWN, this._keyDownHandler);
    }

}
